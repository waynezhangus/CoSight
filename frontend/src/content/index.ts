import { getVideo, addVideo } from '../background/api'
import { getVideoId, secondToStamp, waitForPromise } from './utils'
import { createFloatCard, 
        readComments, 
        createStartCard, 
        deleteStartCard,
        createRangeBar,
        createAccordion } from './components'
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

  const videoSeg = videoData.blackRanges.filter(({score}) => score > 0.5);
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

  // const messageIcon = document.createElement('div');
  // messageIcon.innerHTML = `<svg style="position: absolute;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-dots" viewBox="0 0 16 16">
  // <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
  // <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z"/>
  // </svg>`;

  const scrubber = document.querySelector('.ytp-scrubber-container');
  const tip = document.createElement("img");

  Object.assign(tip, {
    className: 'video-tip',
    src: chrome.runtime.getURL('icon.png'),
    height: 20, // px
    width: 20, // px
    alt: 'tip',
    onclick: () => {}
  })
  scrubber.appendChild(tip);

  video.ontimeupdate = () => {
    const card = document.querySelector('.float-card');
    let curTime = video.currentTime;
    let curSeg = videoSeg.find(({ start, end }) => {
      return (start <= curTime) && (curTime < end);
    });

    // when the user is skipping to a new timestamp
    if (isSeeking) {
      prevSeg = curSeg;
      if (card) card.remove();
      isSeeking = false;
      return;
    }

    if (typeof curSeg !== "undefined") {
      const {start, end, hasVisited} = curSeg;
      if (!hasVisited) {
        canPause = true;
        if (!card) createFloatCard(start, end);
        else if (prevSeg !== curSeg) {
          const text = `From ${secondToStamp(start)} to ${secondToStamp(end)}`;
          card.querySelector('.time-text').innerHTML = text;
          if (prevSeg) prevSeg.hasVisited = true;
        }
      } else {     
        if (card) card.remove();
      }
    } else {
      if (prevSeg) prevSeg.hasVisited = true;
      if (card) card.remove();
    }
    // accessibility mode only
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
  })

  waitForPromise('#comments', document.body).then(parent => {
    createAccordion(commentsTimed, parent);
  })
})


