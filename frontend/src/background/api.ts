import { LocalStorageUser, LocalStorageVideo } from "./storage"

const API_URL = 'https://cosight.herokuapp.com/api/'

interface VideoData {
  videoId: string
  title: string
  captions?: {
    _id: string
    start: number
    dur: number
    text: string
    keywords: string[]
  }[]
  comments?: {
    _id: string
    text: string
    regLike: number
    accLike: number
    score: number
    timestamps: string[]
    keywords: string[]
  }[]
  blackRanges?: {
    _id: string
    start: number
    end: number
    score: number
    hasVisited: boolean
    reason: string
  }[]
  status: 'null' | 'processing' | 'available'
}

async function getVideo(videoId: string): Promise<VideoData> {
  const res = await fetch(`${API_URL}youtube/${videoId}`, {
    method: 'GET',
    mode: 'cors',
  })
  const data: VideoData = await res.json();
  let video: LocalStorageVideo = {
    videoId,
    title: data.title,
    status: 'null',
  }
  if (!res.ok) {
    chrome.storage.local.set({ video })
    return null;
  } else {
    video.status = 'available'
    chrome.storage.local.set({ video })
    return data; 
  }
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

async function commentVote(videoId, commentId, payload) {
  const res = await fetch(`${API_URL}youtube/${videoId}/comment/vote`, {
    method: 'PATCH',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({commentId, payload})
  })
  if (!res.ok) {
    throw new Error('Video not found')
  }
  // const data: VideoData = await res.json()
  // return data
  return null
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
    return null;
    // throw new Error('Login failed')
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
    return null;
    // throw new Error('Registration failed')
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
  commentVote,
  userLogin,
  userRegister,
  userUpdate,
}