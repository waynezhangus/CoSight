import { getVideo, addVideo } from '../background/api'
import { extractTimestamp, getVideoId, secondToStamp, waitForPromise } from './utils'
import { createFloatCard, 
        readComments, 
        createStartCard, 
        deleteStartCard,
        createRangeBar,
        createAccordion, 
        createAddTimeCard,} from './components'
import { LocalStorageOptions } from '../background/storage';

let options: LocalStorageOptions;

chrome.storage.sync.get('options', (data) => options = data.options);

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.options?.newValue) {
    options = changes.options.newValue;
  }
});

// Get the id of the current Youtube video
const video_id = getVideoId(window.location.href);

getVideo(video_id).then((videoData) => {
  if (!videoData) return;

  const videoSeg = videoData.blackRanges.filter(({score}) => score > 0.6);
  console.log("VIDEO SEG!!!!");
  console.log(videoSeg);
  let commentsTimed = videoData.comments
  let ccKeywords = videoData.ccKeywords

  const video = document.getElementsByTagName('video')[0];
  createRangeBar(videoData.blackRanges)

  let prevSeg = undefined;
  let isSeeking = false;
  let canPause = false;

  video.onseeking = () => {
    isSeeking = true;
  }

  video.ontimeupdate = () => {
    const tip = document.querySelector<HTMLElement>('.float-tip');
    const card = document.querySelector<HTMLElement>('.float-card');
    let curTime = video.currentTime;
    let curSeg = videoSeg.find(({ start, end }) => {
      return (start <= curTime) && (curTime < end);
    });

    if (typeof curSeg !== "undefined") {
      const {start, end, hasVisited, reason} = curSeg;
      if (!hasVisited) {
        canPause = true;
        console.log("REASON: " + reason);
        if (tip?.style.display != 'block') createFloatCard(start, end, reason);
        if (prevSeg !== curSeg && card) {
          const timeText = `From ${secondToStamp(start)} to ${secondToStamp(end)}`;
          const reasonText = `Why you are seeing this: ${reason}`;
          card.querySelector('.time-text').innerHTML = timeText;
          card.querySelector('.reason-text').innerHTML = reasonText;
          if (prevSeg) prevSeg.hasVisited = true;
        }
      } else {    
        if (tip) tip.style.display = 'none';
      }
    } else {
      if (prevSeg) prevSeg.hasVisited = true;
      if (tip) tip.style.display = 'none';
    }

    // when the user is skipping to a new timestamp
    if (isSeeking) {
      prevSeg = curSeg;
      if (tip) tip.style.display = 'none';
      isSeeking = false;
      return;
    }
    // accessibility mode
    if (options.mode && (prevSeg !== curSeg) && canPause && prevSeg) {
      readComments(commentsTimed, prevSeg);
      canPause = false;
    }
    prevSeg = curSeg;
  }

  const COMMENT_HOLDER = 'What images are the most significant to the understanding and appreciation of the video?';

  waitForPromise('#primary #contenteditable-root', document.body).then(edit => {
    const holder = document.querySelector('#primary #placeholder-area');
    const dialog = document.querySelector('#primary #comment-dialog');
    createStartCard(commentsTimed.slice(0, 5), dialog);
    holder.addEventListener('mousedown', () => createStartCard(commentsTimed.slice(0, 5), dialog));
    holder.addEventListener('click', () => createStartCard(commentsTimed.slice(0, 5), dialog));
    dialog.querySelector('#buttons').addEventListener('click', deleteStartCard);
    edit.setAttribute('aria-label', COMMENT_HOLDER);
  })

  waitForPromise('#secondary #contenteditable-root', document.body).then(edit => {
    const holder = document.querySelector('#secondary #placeholder-area');
    const dialog = document.querySelector('#secondary #comment-dialog');
    createStartCard(commentsTimed.slice(0, 5), dialog);
    holder.addEventListener('mousedown', () => createStartCard(commentsTimed.slice(0, 5), dialog));
    holder.addEventListener('click', () => createStartCard(commentsTimed.slice(0, 5), dialog));
    dialog.querySelector('#buttons').addEventListener('click', deleteStartCard);
    edit.setAttribute('aria-label', COMMENT_HOLDER);
    edit.oninput = () => {
      const timeCard = document.querySelector<HTMLElement>('.add-time-card');
      const startCard = document.querySelector('#secondary .easy-start-card');
      if (!extractTimestamp(edit.textContent)) createAddTimeCard(startCard);
      else timeCard.style.display = 'none';
    }
  })

  waitForPromise('#comments', document.body).then(parent => {
    createAccordion(commentsTimed, parent);
  })
})


