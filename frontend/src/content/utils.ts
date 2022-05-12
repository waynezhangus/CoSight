function getVideoId(url) {
  const urlObject = new URL(url);
  const pathname = urlObject.pathname;
  if (pathname.startsWith("/clip")) {
    //return document.querySelector("meta[itemprop='videoId']").content;
  } else {
    if (pathname.startsWith("/shorts")) {
      return pathname.slice(8);
    }
    return urlObject.searchParams.get("v");
  }
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

export {
  getVideoId,
  waitForPromise,
};