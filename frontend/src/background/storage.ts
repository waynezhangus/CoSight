interface LocalStorage {
  videos?: LocalStorageVideo
  user?: LocalStorageUser
}

interface LocalStorageVideo {
  videoId: string
  status: 'null' | 'processing' | 'available'
}

interface LocalStorageUser {
  _id?: string
  name?: string
  email?: string
  token?: string
  mode: boolean
}

type LocalStorageKeys = keyof LocalStorage

export {
  LocalStorage,
  LocalStorageVideo,
  LocalStorageUser,
}