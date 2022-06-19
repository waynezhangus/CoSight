
import {
  getVideo,
  addVideo,
} from './api' 
import { LocalStorageUser, LocalStorageVideo } from './storage';

let user: LocalStorageUser = {
  mode: false,
};

let video: LocalStorageVideo = {
  videoId: '',
  status: 'null',
}

chrome.runtime.onInstalled.addListener((object) => {
  chrome.storage.sync.set({ user });
  chrome.storage.local.set({ video });
  let internalUrl = chrome.runtime.getURL("options.html");
  if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: internalUrl });
  }
})
