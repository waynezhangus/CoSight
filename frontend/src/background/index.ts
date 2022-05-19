
import {
  getVideo,
  addVideo,
} from './api' 
import { LocalStorageOptions } from './storage';

let options: LocalStorageOptions = {
  mode: false,
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ options })
})