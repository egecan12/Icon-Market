import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Icon, IconsState } from '../types'
import iconsData from '../data/icon-index.json'

const typedIconsData = iconsData as Icon[]

const initialState: IconsState = {
  allIcons: typedIconsData,
  filteredIcons: typedIconsData,
  selectedIcon: null,
  searchTerm: '',
  selectedCategory: 'All',
  categories: ['All', ...Array.from(new Set(typedIconsData.map(icon => icon.category)))],
  loading: false
}

const iconsSlice = createSlice({
  name: 'icons',
  initialState,
  reducers: {
    setSelectedIcon: (state, action: PayloadAction<Icon | null>) => {
      state.selectedIcon = action.payload
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
      iconsSlice.caseReducers.filterIcons(state)
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
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
    setLoading: (state, action: PayloadAction<boolean>) => {
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
import { RootState } from './store'

export const selectAllIcons = (state: RootState) => state.icons.allIcons
export const selectFilteredIcons = (state: RootState) => state.icons.filteredIcons
export const selectSelectedIcon = (state: RootState) => state.icons.selectedIcon
export const selectSearchTerm = (state: RootState) => state.icons.searchTerm
export const selectSelectedCategory = (state: RootState) => state.icons.selectedCategory
export const selectCategories = (state: RootState) => state.icons.categories
export const selectLoading = (state: RootState) => state.icons.loading

export default iconsSlice.reducer
