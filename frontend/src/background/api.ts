import { LocalStorageVideo } from "./storage"

const API_URL = 'http://localhost:5000/api/youtube/'

interface VideoData {
  videoId: string
  ccKeywords?: {
    text: string
    timestamps: string[]
  }[]
  comments?: {
    text: string
    likeCount: number
    timestamps: string[]
    keywords: string[]
  }[]
  blackRanges?: {
    start: number,
    end: number,
    score: number,
    hasVisited: boolean,
    reason: string,
  }[]
  status: 'null' | 'processing' | 'available'
}

async function getVideo(videoId: string): Promise<VideoData> {
  const res = await fetch(`${API_URL}${videoId}`, {
    method: 'GET',
    mode: 'cors',
  })
  let video: LocalStorageVideo = {
    videoId,
    status: 'null',
  }
  if (!res.ok) {
    video.status = 'null'
    chrome.storage.local.set({ video })
    return null;
  }
  video.status = 'available'
  chrome.storage.local.set({ video })
  const data: VideoData = await res.json();
  return data; 
}

async function addVideo(videoId: string): Promise<VideoData> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(videoId)
  })
  if (!res.ok) {
    throw new Error('Video not found')
  }
  const data: VideoData = await res.json()
  return data
}

export {
  VideoData,
  getVideo,
  addVideo,
}