import { getVideo, rangeVisited } from '../background/api'
import { feedBack, 
        extractTimestamp, 
        getVideoId, 
        secondToStamp, 
        waitForPromise, 
        stampToSecond} from './utils'
import { createFloatCard, 
        readComments, 
        createStartCard, 
        createRangeBar,
        createAccordion, 
        createAddTimeCard,
        editStartCard,
        createClarifyCard,} from './components'
import { LocalStorageUser } from '../background/storage';
import keyword_extractor from 'keyword-extractor';

let user: LocalStorageUser;
declare global {
  interface Window { keyDownHandler: any }
}

chrome.storage.sync.get('user', (data) => user = data.user);

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.user?.newValue) {
    user = changes.user.newValue;
  }
});

// Get the id of the current Youtube video
const videoId = getVideoId(window.location.href);
const thresh = 0.5
const language: any = 'english'
const keywordOptions = {
  language,
  remove_digits: true,
  return_changed_case: true,
  remove_duplicates: true,
  return_chained_words: false
}

getVideo(videoId).then((videoData) => {
  if (!videoData) return;

  const blackRanges = videoData.blackRanges
  const totalTime = blackRanges[blackRanges.length - 1].end;

  blackRanges.forEach((range, index) => {
    if ((range.start <= 15 || range.end >= (totalTime - 15) ||
        (range.end-range.start) <= 1) && range.score < 0.49) {
      videoData.blackRanges[index].score = 0.49
    }
  })

  const videoSeg = videoData.blackRanges.filter(({score}) => score < thresh);
  let commentsTimed = videoData.comments
  let captions = videoData.captions

  const video = document.getElementsByTagName('video')[0];
  createRangeBar(videoData.blackRanges, thresh)

  let prevSeg = undefined;
  let curSeg = undefined;
  let isSeeking = false;
  let canPause = false;

  video.onseeking = () => {
    isSeeking = true;
  }

  video.onpause = () => {
    if (user.mode && !user.pauseEnable) {
      if (curSeg) {
        readComments(videoId, commentsTimed, curSeg);
      } else {
        document.removeEventListener("keydown", window.keyDownHandler);
        window.keyDownHandler = function handleKeyDown (event) {
          const msg = new SpeechSynthesisUtterance();
          if (event.key == 'Shift') {
            msg.text = 'This segment is rather accessible. Press shift to listen to all the comments before this point';
            window.speechSynthesis.speak(msg);
            document.removeEventListener("keydown", window.keyDownHandler);
            readComments(videoId, commentsTimed, {start:0, end:video.currentTime})
          }
        }
        document.addEventListener('keydown', window.keyDownHandler)
      }
    }
  }

  video.ontimeupdate = () => {
    const tip = document.querySelector<HTMLElement>('.float-tip');
    const card = document.querySelector<HTMLElement>('.float-card');
    let curTime = video.currentTime;
    curSeg = videoSeg.find(({ start, end }) => {
      return (start <= curTime) && (curTime < end);
    });

    // when the user is skipping to a new timestamp
    if (isSeeking) {
      prevSeg = curSeg;
      if (tip) tip.style.display = 'none';
      isSeeking = false;
      return;
    }

    if (typeof curSeg !== "undefined") {
      const {start, end, hasVisited, reason} = curSeg;
      if (!hasVisited) {
        canPause = true;
        if (tip?.style.display != 'block') createFloatCard(start, end, reason, videoId, videoData.title);
        if (prevSeg !== curSeg && card) {
          const timeText = `From ${secondToStamp(start)} to ${secondToStamp(end)}:`;
          card.querySelector('.time-text').innerHTML = timeText;
          card.querySelector('.reason-text').innerHTML = reason;
          if (prevSeg && user.visitedEnable) {
            prevSeg.hasVisited = true;
            rangeVisited(videoId, prevSeg._id, true)
          }
        }
      } else {    
        if (tip) tip.style.display = 'none';
      }
    } else {
      if (prevSeg && user.visitedEnable) {
        prevSeg.hasVisited = true;
        rangeVisited(videoId, prevSeg._id, true)
      }
      if (tip) tip.style.display = 'none';
    }

    // accessibility mode
    if (user.mode 
      && user.pauseEnable 
      && (prevSeg !== curSeg) 
      && canPause && prevSeg) {
      video.pause();
      readComments(videoId, commentsTimed, prevSeg);
      canPause = false;
    }
    prevSeg = curSeg;
  }

  function startCard(location) {
    let captionsMatch = captions.slice(3, 6)
    let commentsMatch = commentsTimed.slice(0, 3)
    let keywords = []
    const COMMENT_HOLDER = ['What are the most significant visuals to understand the video?',
                          'Which text or visual concepts that are not explained in the speech?',
                          'Write a comment with visual descriptions to help the blind audiences!'];
    const pronouns = /\b((it)|(this)|(that)|(these)|(those)|(here))\b/
    waitForPromise(`${location} #contenteditable-root`, document.body).then(edit => {
      edit.setAttribute('aria-label', COMMENT_HOLDER[Math.floor(Math.random()*3)]);
      const dialog = document.querySelector<HTMLElement>(`${location} #comment-dialog`);
      createStartCard(dialog);
      editStartCard(captionsMatch, commentsMatch, keywords, dialog)

      dialog.querySelector('#buttons').addEventListener('click', () => {
        const timeCard = dialog.querySelector<HTMLElement>('.add-time-card');
        if (timeCard) timeCard.style.display = 'none';
        edit.setAttribute('aria-label', COMMENT_HOLDER[Math.floor(Math.random()*3)]);
        const capRandom = Math.floor(Math.random()*(captions.length-4))
        const comRandom = Math.floor(Math.random()*(commentsTimed.length-4))
        captionsMatch = captions.slice(capRandom, capRandom+3)
        commentsMatch = commentsTimed.slice(comRandom, comRandom+3)
        keywords = []
        editStartCard(captionsMatch, commentsMatch, keywords, dialog)
      });
      dialog.querySelector('#submit-button').addEventListener('click', () => {
        feedBack(videoId, videoData.title, 'userComments', edit.textContent)
      });

      let wordLength = 1
      edit.oninput = () => {
        captionsMatch = []
        commentsMatch = []
        keywords = []
        const words = edit.textContent.split(' ')
        const timeCard = dialog.querySelector<HTMLElement>('.add-time-card');
        const clarifyCard = dialog.querySelector<HTMLElement>('.clarify-card');
        if (words.length != wordLength) {
          if (words.length == 1) {
            const capRandom = Math.floor(Math.random()*(captions.length-4))
            const comRandom = Math.floor(Math.random()*(commentsTimed.length-4))
            captionsMatch = captions.slice(capRandom, capRandom+3)
            commentsMatch = commentsTimed.slice(comRandom, comRandom+3)
            keywords = []
            editStartCard(captionsMatch, commentsMatch, keywords, dialog)
            if (clarifyCard) clarifyCard.style.display = 'none';
            if (timeCard) timeCard.style.display = 'none';
          } else {
            //pronouns match
            if (pronouns.test(edit.textContent)) createClarifyCard(dialog);
            else if (clarifyCard) clarifyCard.style.display = 'none';

            //timestamp match
            const timestamps = extractTimestamp(edit.textContent)
            if (!timestamps) createAddTimeCard(dialog); 
            else {
              if (timeCard) timeCard.style.display = 'none';    
              timestamps.forEach(timestamp => {
                const time = stampToSecond(timestamp)
                let a = captions.filter(({start, dur}) => (
                  start <= time && time < (start + dur)
                ))
                captionsMatch.push(...a)
                let b = commentsTimed.filter(({timestamps}) => 
                  Boolean(timestamps.find(timestamp => (
                    (time - 5) <= stampToSecond(timestamp) && stampToSecond(timestamp) < (time + 5)
                  )))
                )
                commentsMatch.push(...b)
              })
            }

            //keywords match
            keywords = keyword_extractor.extract(edit.textContent, keywordOptions)
            if (keywords.length != 0) {
              let a = captions.filter(caption => keywords.every(keyword => caption.keywords.includes(keyword)))
              captionsMatch.push(...a)
              let b = commentsTimed.filter(comment => keywords.every(keyword => comment.keywords.includes(keyword)))
              commentsMatch.push(...b)
            }
            editStartCard(captionsMatch, commentsMatch, keywords, dialog)
          }
        }
        wordLength = words.length
      }
    })
  }

  startCard('#primary');
  startCard('#secondary');

  waitForPromise('#comments', document.body).then(parent => {
    createAccordion(commentsTimed, parent);
  })
})


