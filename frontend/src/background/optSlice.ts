import { createSlice, PayloadAction } from '@reduxjs/toolkit'
//import type { RootState } from './store'

interface OptState {
  mode: boolean   // 0: regular, 1: accessible
}

const initialState: OptState = {
  mode: false
}

export const optSlice = createSlice({
  name: 'opt',
  initialState,
  reducers: {
    update: (state, action: PayloadAction<OptState>) => {
      state.mode = action.payload.mode
    }
  }
})

export const { update } = optSlice.actions
export default optSlice.reducer