import { configureStore } from '@reduxjs/toolkit'
import { wrapStore } from 'webext-redux'
import logger from 'redux-logger'
import optReducer from './optSlice'

export const store = configureStore({
  reducer: {
    opt: optReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger),
})

wrapStore(store)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
