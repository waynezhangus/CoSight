interface LocalStorage {
  videos?: LocalStorageVideo
  options?: LocalStorageOptions
}

interface LocalStorageVideo {
  videoId: string
  status: 'null' | 'processing' | 'available'
}

interface LocalStorageOptions {
  mode: boolean
}

type LocalStorageKeys = keyof LocalStorage

function setStoredVideo(videos: LocalStorageVideo): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({videos}, () => {
      resolve()
    })
  })
}

function getStoredVideo(): Promise<LocalStorageVideo> {
  const keys: LocalStorageKeys[] = ['videos']
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (res: LocalStorage) => {
      resolve(res.videos)
    })
  })
}

function setStoredOptions(options: LocalStorageOptions): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set({options}, () => {
      resolve()
    })
  })
}

function getStoredOptions(): Promise<LocalStorageOptions> {
  const keys: LocalStorageKeys[] = ['options']
  return new Promise((resolve) => {
    chrome.storage.sync.get(keys, (res: LocalStorage) => {
      resolve(res.options)
    })
  })
}

export {
  LocalStorage,
  LocalStorageVideo,
  LocalStorageOptions,
  setStoredVideo,
  getStoredVideo,
}