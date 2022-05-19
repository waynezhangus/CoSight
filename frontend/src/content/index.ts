import { getVideo, addVideo } from '../background/api'
import { getVideoId, waitForPromise } from './utils'
import { createFloatCard, 
        readComments, 
        createStartCard, 
        deleteStartCard,
        createRangeBar,
        createAccordion } from './components'
import { LocalStorageOptions } from '../background/storage';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

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

  console.log(commentsTimed);

  const video = document.getElementsByTagName('video')[0];
  createRangeBar(videoData.blackRanges)

  let prevSeg = undefined;
  let isSeeking = false;
  let canPause = false;

  video.onseeking = () => {
    isSeeking = true;
  }

  const scrubber = document.querySelector('.ytp-scrubber-container');
    const tip = document.createElement("img");
    Object.assign(tip, {
      className: 'video-tip',
      src: 'static/icon',
      height: 120, // pixels
      width: 160, // pixels
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
          const text = `From ${start} to ${end}`;
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
    holder.addEventListener('click', () => createStartCard(commentsTimed.slice(0, 5), dialog));
    dialog.querySelector('#buttons').addEventListener('click', deleteStartCard);
    document.querySelector('#chevron').addEventListener('click', deleteStartCard);
    edit.setAttribute('aria-label', COMMENT_HOLDER);
  })

  waitForPromise('#secondary #contenteditable-root', document.body).then(edit => {
    const holder = document.querySelector('#secondary #placeholder-area');
    const dialog = document.querySelector('#secondary #comment-dialog');
    createStartCard(commentsTimed.slice(0, 5), dialog);
    holder.addEventListener('click', () => createStartCard(commentsTimed.slice(0, 5), dialog));
    dialog.querySelector('#buttons').addEventListener('click', deleteStartCard);
    const panel = document.querySelector("ytd-engagement-panel-section-list-renderer[target-id='engagement-panel-comments-section']")
    panel.querySelector('#visibility-button').addEventListener('click', deleteStartCard);
    edit.setAttribute('aria-label', COMMENT_HOLDER);
  })

  waitForPromise('#comments', document.body).then(parent => {
    createAccordion(commentsTimed, parent);
  })
})


