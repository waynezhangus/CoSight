import {
  getStoredCities,
  getStoredOptions,
  setStoredCities,
  setStoredOptions,
} from './storage'
import {
  getVideo,
  addVideo,
} from './api' 

chrome.runtime.onInstalled.addListener(() => {
  setStoredOptions({
    mode: false
  })
  getVideo('wezZVZXFO3U').then((video) => {
    console.log(video)
  })
})