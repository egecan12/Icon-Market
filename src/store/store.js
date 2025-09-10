import { configureStore } from '@reduxjs/toolkit'
import iconsReducer from './iconsSlice'

export const store = configureStore({
  reducer: {
    icons: iconsReducer
  }
})
