
function domReady(callback) {
  if (document.readyState === "complete") {
    callback()
  } else {
    window.addEventListener("load", callback, {
      once: true,
    })
  }
}

function waitFor(selector: string, callback, timeout?: number) {
  const element = document.querySelector(selector);
  if (element) {
    callback(element)
  } else {
    if (timeout) {
      return window.setTimeout(() => {
        return window.requestAnimationFrame(() => {
          waitFor(selector, callback)
        });
      }, timeout)
    }
    return window.requestAnimationFrame(() => {
      waitFor(selector, callback)
    })
  }
}

function waitForPromise(selector: string, parent: Element) {
  return new Promise(resolve => {
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