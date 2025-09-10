import { createSlice } from '@reduxjs/toolkit'
import iconsData from '../data/icon-index.json'

const initialState = {
  allIcons: iconsData,
  filteredIcons: iconsData,
  selectedIcon: null,
  searchTerm: '',
  selectedCategory: 'All',
  categories: ['All', ...Array.from(new Set(iconsData.map(icon => icon.category)))],
  // Error handling state
  error: null,
  hasError: false,
  loading: false
}

const iconsSlice = createSlice({
  name: 'icons',
  initialState,
  reducers: {
    setSelectedIcon: (state, action) => {
      state.selectedIcon = action.payload
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload
      iconsSlice.caseReducers.filterIcons(state)
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload
      iconsSlice.caseReducers.filterIcons(state)
    },
    filterIcons: (state) => {
      try {
        state.filteredIcons = state.allIcons.filter(icon => {
          const matchesCategory = state.selectedCategory === "All" || icon.category === state.selectedCategory
          const matchesSearch = icon.name.toLowerCase().includes(state.searchTerm.toLowerCase())
          return matchesCategory && matchesSearch
        })
        // Clear any previous errors on successful operation
        state.error = null
        state.hasError = false
      } catch (error) {
        state.error = "Failed to filter icons. Please try again."
        state.hasError = true
      }
    },
    // Error handling actions
    setError: (state, action) => {
      state.error = action.payload
      state.hasError = true
    },
    clearError: (state) => {
      state.error = null
      state.hasError = false
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    // Basic error handling actions
    handleError: (state, action) => {
      state.error = action.payload;
      state.hasError = true;
    }
  }
})

export const { 
  setSelectedIcon, 
  setSearchTerm, 
  setSelectedCategory, 
  filterIcons, 
  setError, 
  clearError, 
  setLoading,
  handleError
} = iconsSlice.actions

// All of my Selectors located here
export const selectAllIcons = (state) => state.icons.allIcons
export const selectFilteredIcons = (state) => state.icons.filteredIcons
export const selectSelectedIcon = (state) => state.icons.selectedIcon
export const selectSearchTerm = (state) => state.icons.searchTerm
export const selectSelectedCategory = (state) => state.icons.selectedCategory
export const selectCategories = (state) => state.icons.categories
// Error handling selectors
export const selectError = (state) => state.icons.error
export const selectHasError = (state) => state.icons.hasError
export const selectLoading = (state) => state.icons.loading

export default iconsSlice.reducer
