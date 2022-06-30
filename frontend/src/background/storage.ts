interface LocalStorage {
  videos?: LocalStorageVideo
  user?: LocalStorageUser
}

interface LocalStorageVideo {
  videoId: string
  title: string
  status: 'null' | 'processing' | 'available'
}

interface LocalStorageUser {
  _id?: string
  name?: string
  email?: string
  token?: string
  mode: boolean
  isAdmin?: boolean
  pauseEnable?: boolean
  visitedEnable?: boolean
  statistics?: {
    videoId?: string
    title?: string
    userComments?: string[]
    iconStamps?: string[]
  }[]
}

type LocalStorageKeys = keyof LocalStorage

export {
  LocalStorage,
  LocalStorageVideo,
  LocalStorageUser,
}