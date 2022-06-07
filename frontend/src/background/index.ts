
import {
  getVideo,
  addVideo,
} from './api' 
import { LocalStorageOptions, LocalStorageVideo } from './storage';

let options: LocalStorageOptions = {
  mode: false,
};

let video: LocalStorageVideo = {
  videoId: '',
  status: 'null',
}

chrome.runtime.onInstalled.addListener((object) => {
  chrome.storage.sync.set({ options });
  chrome.storage.local.set({ video });
  let internalUrl = chrome.runtime.getURL("onboarding.html");
  if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: internalUrl });
  }
})
