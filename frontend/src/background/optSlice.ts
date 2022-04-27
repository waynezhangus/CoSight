import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const test = createAsyncThunk(
  'opt/test',
  async (id: number, thunkAPI) => {
    try {
      const res = await axios.get('https://jsonplaceholder.typicode.com/todos/1')
      return res.data
    } catch (err) {
      const error =
        (err?.response?.data?.message) ||
        err.message ||
        err.toString()
      return thunkAPI.rejectWithValue(error)
    }
  }
)

interface OptState {
  mode?: boolean   // 0: regular, 1: accessible
  count?: number
}

const initialState: OptState = {
  mode: false,
  count: 0
}

export const optSlice = createSlice({
  name: 'opt',
  initialState,
  reducers: {
    update: (state, action: PayloadAction<OptState>) => {
      state = Object.assign(state, action.payload)
    },
    add: state => {
      state.count += 1
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(test.fulfilled, (state, action) => {
        console.log(action.payload)
      })
  },
})

export const { update, add } = optSlice.actions
export default optSlice.reducer