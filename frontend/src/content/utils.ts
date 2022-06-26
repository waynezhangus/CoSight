import { userUpdate } from "../background/api";

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
  const minSecondArray = timestamp.split(':')
  return parseInt(minSecondArray[0]) * 60 + parseInt(minSecondArray[1])
}

function secondToStamp(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.round(time - minutes * 60);
  return String(minutes) + ":" + ('0' + String(seconds)).slice(-2); 
}

// Extract timestamps from a comment
// Assume the videos do not exceed 1 hour
function extractTimestamp(comment) {
  return comment.match(/\b[0-5]?\d:[0-5]\d\b/g);
}

function waitForPromise(selector: string, parent: Element) {
  return new Promise<HTMLElement>(resolve => {
    let target = parent.querySelector<HTMLElement>(selector)
    if(target) {
      resolve(target)
    } else {
      const observer = new MutationObserver(mutations => {
        target = parent.querySelector<HTMLElement>(selector)
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

function feedBack(videoId, title, name, value) {
  chrome.storage.sync.get('user', ({user}) => {
    if (user.statistics) {
      const vIndex = user.statistics.findIndex(v => v.videoId == videoId)
      if (vIndex != -1) {
        user.statistics[vIndex][name] = user.statistics[vIndex][name]
                                        ? [...user.statistics[vIndex][name], value]
                                        : [value]
      } else {
        user.statistics.push({
          videoId, 
          title,
          [name]: [value],
        })
      }
      chrome.storage.sync.set({user})
      userUpdate({
        statistics: user.statistics,
        token: user.token,
      })
    } else {
      console.log('Please sign in')
    }
  })
}

export {
  getVideoId,
  waitForPromise,
  stampToSecond,
  secondToStamp,
  extractTimestamp,
  feedBack,
};