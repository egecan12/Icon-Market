import { configureStore } from '@reduxjs/toolkit'
import iconsReducer from './iconsSlice'
import errorReducer from './errorSlice'

export const store = configureStore({
  reducer: {
    icons: iconsReducer,
    error: errorReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
