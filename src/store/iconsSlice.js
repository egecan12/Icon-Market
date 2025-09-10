import { createSlice } from '@reduxjs/toolkit'
import iconsData from '../data/icon-index.json'

const initialState = {
  allIcons: iconsData,
  filteredIcons: iconsData,
  selectedIcon: null,
  searchTerm: '',
  selectedCategory: 'All',
  categories: ['All', ...Array.from(new Set(iconsData.map(icon => icon.category)))],
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
      state.filteredIcons = state.allIcons.filter(icon => {
        const matchesCategory = state.selectedCategory === "All" || icon.category === state.selectedCategory
        const matchesSearch = icon.name.toLowerCase().includes(state.searchTerm.toLowerCase())
        return matchesCategory && matchesSearch
      })
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    }
  }
})

export const { 
  setSelectedIcon, 
  setSearchTerm, 
  setSelectedCategory, 
  filterIcons,
  setLoading
} = iconsSlice.actions

// All of my Selectors located here
export const selectAllIcons = (state) => state.icons.allIcons
export const selectFilteredIcons = (state) => state.icons.filteredIcons
export const selectSelectedIcon = (state) => state.icons.selectedIcon
export const selectSearchTerm = (state) => state.icons.searchTerm
export const selectSelectedCategory = (state) => state.icons.selectedCategory
export const selectCategories = (state) => state.icons.categories
// Error handling selectors
export const selectLoading = (state) => state.icons.loading

export default iconsSlice.reducer
