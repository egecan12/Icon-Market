import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ErrorState, ErrorPayload } from '../types'

const initialState: ErrorState = {
  error: null,
  hasError: false,
  errorType: null,
  timestamp: null
}

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<ErrorPayload>) => {
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
export const selectError = (state: { error: ErrorState }) => state.error.error
export const selectHasError = (state: { error: ErrorState }) => state.error.hasError
export const selectErrorType = (state: { error: ErrorState }) => state.error.errorType
export const selectErrorTimestamp = (state: { error: ErrorState }) => state.error.timestamp

export default errorSlice.reducer
