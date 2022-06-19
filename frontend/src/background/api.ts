import { LocalStorageUser, LocalStorageVideo } from "./storage"

const API_URL = 'http://localhost:5000/api/'

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
  const res = await fetch(`${API_URL}youtube/${videoId}`, {
    method: 'GET',
    mode: 'cors',
  })
  let video: LocalStorageVideo = {
    videoId,
    status: 'null',
  }
  if (!res.ok) {
    chrome.storage.local.set({ video })
    return null;
  }
  video.status = 'available'
  chrome.storage.local.set({ video })
  const data: VideoData = await res.json();
  return data; 
}

async function addVideo(videoId: string): Promise<VideoData> {
  const res = await fetch(`${API_URL}youtube/`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({videoId})
  })
  if (!res.ok) {
    throw new Error('Video not found')
  }
  const data: VideoData = await res.json()
  return data
}

async function userLogin(form) {
  const res = await fetch(`${API_URL}users/login`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(form)
  })
  if (!res.ok) {
    throw new Error('Login failed')
  }
  const user: LocalStorageUser = await res.json()
  chrome.storage.sync.set({ user })
  return user
}

async function userRegister(form) {
  const res = await fetch(`${API_URL}users/`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(form)
  })
  if (!res.ok) {
    throw new Error('Registration failed')
  }
  const user: LocalStorageUser = await res.json()
  chrome.storage.sync.set({ user })
  return user
}

async function userUpdate(form) {
  const res = await fetch(`${API_URL}users/update`, {
    method: 'PATCH',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${form.token}`,
    },
    body: JSON.stringify(form)
  })
  if (!res.ok) {
    throw new Error('Update failed')
  }
  const user: LocalStorageUser = await res.json()
  chrome.storage.sync.set({ user })
  return user
}

export {
  VideoData,
  getVideo,
  addVideo,
  userLogin,
  userRegister,
  userUpdate,
}