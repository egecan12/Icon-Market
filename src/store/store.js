import { configureStore } from '@reduxjs/toolkit'
import iconsReducer from './iconsSlice'
import errorReducer from './errorSlice'

export const store = configureStore({
  reducer: {
    icons: iconsReducer,
    error: errorReducer
  }
})
