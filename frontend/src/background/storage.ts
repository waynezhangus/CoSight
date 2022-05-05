export interface LocalStorage {
  videos?: LocalStorageVideos
  options?: LocalStorageOptions
}

export interface LocalStorageVideos {
  videoId: string
  status: 'null' | 'processing' | 'available'
}

export interface LocalStorageOptions {
  mode: boolean
}

export type LocalStorageKeys = keyof LocalStorage

export function setStoredCities(videos: LocalStorageVideos): Promise<void> {
  const vals: LocalStorage = {
    videos,
  }
  return new Promise((resolve) => {
    chrome.storage.local.set(vals, () => {
      resolve()
    })
  })
}

export function getStoredCities(): Promise<LocalStorageVideos> {
  const keys: LocalStorageKeys[] = ['videos']
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (res: LocalStorage) => {
      resolve(res.videos)
    })
  })
}

export function setStoredOptions(options: LocalStorageOptions): Promise<void> {
  const vals: LocalStorage = {
    options,
  }
  return new Promise((resolve) => {
    chrome.storage.local.set(vals, () => {
      resolve()
    })
  })
}

export function getStoredOptions(): Promise<LocalStorageOptions> {
  const keys: LocalStorageKeys[] = ['options']
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (res: LocalStorage) => {
      resolve(res.options)
    })
  })
}
