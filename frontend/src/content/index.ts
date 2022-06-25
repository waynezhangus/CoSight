import { getVideo, rangeVisited } from '../background/api'
import { feedBack, 
        extractTimestamp, 
        getVideoId, 
        secondToStamp, 
        waitForPromise } from './utils'
import { createFloatCard, 
        readComments, 
        createStartCard, 
        deleteStartCard,
        createRangeBar,
        createAccordion, 
        createAddTimeCard,} from './components'
import { LocalStorageUser } from '../background/storage';

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

getVideo(videoId).then((videoData) => {
  if (!videoData) return;

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

  const COMMENT_HOLDER = ['What are the most significant visuals to understand the video?',
                          'Which text or visual concepts that are not explained in the speech?',
                          'Write a comment with visual descriptions to help the blind audiences!'];

  waitForPromise('#primary #contenteditable-root', document.body).then(edit => {
    edit.setAttribute('aria-label', COMMENT_HOLDER[Math.floor(Math.random()*3)]);
    const holder = document.querySelector('#primary #placeholder-area');
    const dialog = document.querySelector('#primary #comment-dialog');
    createStartCard(commentsTimed.slice(0, 5), dialog);
    holder.addEventListener('mousedown', () => createStartCard(commentsTimed.slice(0, 5), dialog));
    holder.addEventListener('click', () => createStartCard(commentsTimed.slice(0, 5), dialog));
    dialog.querySelector('#buttons').addEventListener('click', () => {
      deleteStartCard;
      edit.setAttribute('aria-label', COMMENT_HOLDER[Math.floor(Math.random()*3)]);
    });
    dialog.querySelector('#submit-button').addEventListener('click', () => feedBack(videoId, videoData.title, 'userComments', edit.textContent));
  })

  waitForPromise('#secondary #contenteditable-root', document.body).then(edit => {
    edit.setAttribute('aria-label', COMMENT_HOLDER[Math.floor(Math.random()*3)]);
    const holder = document.querySelector('#secondary #placeholder-area');
    const dialog = document.querySelector('#secondary #comment-dialog');
    createStartCard(commentsTimed.slice(0, 5), dialog);
    holder.addEventListener('mousedown', () => createStartCard(commentsTimed.slice(0, 5), dialog));
    holder.addEventListener('click', () => createStartCard(commentsTimed.slice(0, 5), dialog));
    dialog.querySelector('#buttons').addEventListener('click', () => {
      deleteStartCard;
      edit.setAttribute('aria-label', COMMENT_HOLDER[Math.floor(Math.random()*3)]);
    });
    dialog.querySelector('#submit-button').addEventListener('click', () => feedBack(videoId, videoData.title, 'userComments', edit.textContent));
    edit.oninput = () => {
      const timeCard = document.querySelector<HTMLElement>('.add-time-card');
      const startCard = document.querySelector('#secondary .easy-start-card');
      if (!extractTimestamp(edit.textContent)) createAddTimeCard(startCard);
      else if (timeCard) timeCard.style.display = 'none';
    }
  })

  waitForPromise('#comments', document.body).then(parent => {
    createAccordion(commentsTimed, parent);
  })
})


