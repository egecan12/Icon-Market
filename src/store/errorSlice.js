import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  error: null,
  hasError: false,
  errorType: null, // 'validation', 'network', 'data', etc.
  timestamp: null
}

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload.message
      state.hasError = true
      state.errorType = action.payload.type || 'general'
      state.timestamp = new Date().toISOString()
    },
    clearError: (state) => {
      state.error = null
      state.hasError = false
      state.errorType = null
      state.timestamp = null
    }
  }
})

export const { setError, clearError } = errorSlice.actions

// Selectors
export const selectError = (state) => state.error.error
export const selectHasError = (state) => state.error.hasError
export const selectErrorType = (state) => state.error.errorType
export const selectErrorTimestamp = (state) => state.error.timestamp

export default errorSlice.reducer
