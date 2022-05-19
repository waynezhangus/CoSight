import { getVideo, addVideo } from '../background/api'
import { getVideoId, waitForPromise, stampToSecond, extractTimestamp } from './utils'
import { createFloatCard, 
        deleteFloatCard, 
        readComments, 
        createEasyStartCard, 
        createRangeBar, 
        createAccordion } from './components'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// const bootstrapLink = document.createElement("link");
// bootstrapLink.setAttribute("href", "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css");
// bootstrapLink.setAttribute("rel", "stylesheet");
// document.head.appendChild(bootstrapLink);

// Get the id of the current Youtube video
const video_id = getVideoId(window.location.href);

let mode = false;

getVideo(video_id).then((videoData) => {

  const videoSeg = videoData.blackRanges.filter(({score}) => score > 0.5);
  let commentsTimed = videoData.comments
  let ccKeywords = videoData.ccKeywords

  console.log(commentsTimed);

  const video = document.getElementsByTagName('video')[0];
  createRangeBar(videoData.blackRanges)

  let prevSeg = undefined;
  let isSeeking = false;

  video.onseeking = () => {
    isSeeking = true;
  }

  video.ontimeupdate = () => {
    let curTime = video.currentTime;
    let curSeg = videoSeg.find(({ start, end }) => {
      return (start <= curTime) && (curTime < end);
    });

    // when the user is moving/skipping to a new timestamp
    if (isSeeking) {
      prevSeg = curSeg;
      isSeeking = false;
      return;
    }

    if (!mode) {
      if (curSeg != prevSeg) {
        if (!prevSeg) {
          if (!curSeg.hasVisited) {
            createFloatCard(curSeg);
            curSeg.hasVisited = true;
          }     
        } else if (!curSeg) {
          deleteFloatCard();
        } else {
          deleteFloatCard();
          if (!curSeg.hasVisited) {
            createFloatCard(curSeg);
            curSeg.hasVisited = true;
          } 
        }
      }
    } else {
      if (curSeg != prevSeg) {
        if (prevSeg) {
          if (!prevSeg.hasVisited) {
            readComments(commentsTimed, prevSeg);
            prevSeg.hasVisited = true;
          }
        } 
      }
    }
    prevSeg = curSeg;
  }

  let observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (!mutation.addedNodes) return

      for (let i = 0; i < mutation.addedNodes.length; i++) {
        // do things to your newly added nodes here
        let node = mutation.addedNodes[i]

        console.log(node);

        if (node['id'] === 'contenteditable-root') {

          createEasyStartCard(commentsTimed.slice(0, 5));
          createAccordion(commentsTimed);

          let comment = document.getElementById('contenteditable-root');

          node['ariaLabel'] =
            'What images are the most significant to the understanding and appreciation of the video?';
          // node.classList.push()
          comment.onkeypress = function (e) {
            console.log('key pressed!')
            console.log(comment.textContent)
          }
        }
      }
    })
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: false,
  })
})


