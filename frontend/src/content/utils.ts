function getVideoId(url) {
  const urlObject = new URL(url);
  const pathname = urlObject.pathname;
  if (pathname.startsWith("/clip")) {
    //return document.querySelector("meta[itemprop='videoId']").content;
  } else if (pathname.startsWith("/shorts")) {
    return pathname.slice(8);
  } else {
    return urlObject.searchParams.get("v");
  }
}

function stampToSecond(timestamp) {
  const min_second_arr = timestamp.split(':')
  return parseInt(min_second_arr[0]) * 60 + parseInt(min_second_arr[1])
}

// Extract timestamps from a comment
// Assume the videos do not exceed 1 hour
function extractTimestamp(comment) {
  return comment.match(/[0-5]?[0-9]:[0-5][0-9]/g);
}

function waitForPromise(selector: string, parent: Element) {
  return new Promise<Element>(resolve => {
    let target = parent.querySelector(selector)
    if(target) {
      resolve(target)
    } else {
      const observer = new MutationObserver(mutations => {
        target = parent.querySelector(selector)
        if(target) {
          resolve(target)
          observer.disconnect()
        }
      })
      observer.observe(parent, {
        childList: true,  subtree: true
      })
    }
  })
}

function isVideoLoaded() {
  const videoId = getVideoId(window.location.href);
  return (
    document.querySelector(`ytd-watch-flexy[video-id='${videoId}']`) !== null ||
    // mobile: no video-id attribute
    document.querySelector('#player[loading="false"]:not([hidden])') !== null
  );
}

function domReady(callback) {
  if (document.readyState === "complete") {
    callback();
  } else {
    window.addEventListener("load", callback, {
      once: true,
    });
  }
}

export {
  getVideoId,
  waitForPromise,
  stampToSecond,
  extractTimestamp,
};