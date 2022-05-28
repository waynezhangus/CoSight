
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

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ options });
  chrome.storage.local.set({ video });
})