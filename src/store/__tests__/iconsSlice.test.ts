import { describe, it, expect } from 'vitest'
import iconsReducer, {
  setSelectedIcon,
  setSearchTerm,
  setSelectedCategory,
  filterIcons,
  setLoading,
} from '../iconsSlice'
import type { IconsState } from '../../types'

// Mock icon data for testing
const mockIcon1 = { name: 'test-icon', category: 'test-category', svg: '<svg></svg>' }
const mockIcon2 = { name: 'another-icon', category: 'another-category', svg: '<svg></svg>' }
const mockIcon3 = { name: 'test-search', category: 'test-category', svg: '<svg></svg>' }

const mockIcons = [mockIcon1, mockIcon2, mockIcon3]

const initialTestState: IconsState = {
  allIcons: mockIcons,
  filteredIcons: mockIcons,
  selectedIcon: null,
  searchTerm: '',
  selectedCategory: 'All',
  categories: ['All', 'test-category', 'another-category'],
  loading: false,
}

describe('iconsSlice', () => {
  describe('reducers', () => {
    describe('setSelectedIcon', () => {
      it('should set the selected icon', () => {
        const action = setSelectedIcon(mockIcon1)
        const newState = iconsReducer(initialTestState, action)
        
        expect(newState.selectedIcon).toEqual(mockIcon1)
      })

      it('should allow setting selected icon to null', () => {
        const stateWithSelected = { ...initialTestState, selectedIcon: mockIcon1 }
        const action = setSelectedIcon(null)
        const newState = iconsReducer(stateWithSelected, action)
        
        expect(newState.selectedIcon).toBeNull()
      })

      it('should not affect other state properties', () => {
        const action = setSelectedIcon(mockIcon1)
        const newState = iconsReducer(initialTestState, action)
        
        expect(newState.allIcons).toEqual(initialTestState.allIcons)
        expect(newState.filteredIcons).toEqual(initialTestState.filteredIcons)
        expect(newState.searchTerm).toEqual(initialTestState.searchTerm)
      })
    })

    describe('setSearchTerm', () => {
      it('should set the search term and trigger filtering', () => {
        const action = setSearchTerm('test')
        const newState = iconsReducer(initialTestState, action)
        
        expect(newState.searchTerm).toBe('test')
        // Should filter icons containing 'test'
        expect(newState.filteredIcons).toHaveLength(2)
        expect(newState.filteredIcons).toContain(mockIcon1)
        expect(newState.filteredIcons).toContain(mockIcon3)
      })

      it('should handle empty search term', () => {
        const stateWithSearch = { ...initialTestState, searchTerm: 'test' }
        const action = setSearchTerm('')
        const newState = iconsReducer(stateWithSearch, action)
        
        expect(newState.searchTerm).toBe('')
        expect(newState.filteredIcons).toEqual(mockIcons)
      })

      it('should be case insensitive', () => {
        const action = setSearchTerm('TEST')
        const newState = iconsReducer(initialTestState, action)
        
        expect(newState.filteredIcons).toHaveLength(2)
        expect(newState.filteredIcons).toContain(mockIcon1)
        expect(newState.filteredIcons).toContain(mockIcon3)
      })

      it('should handle search terms with no matches', () => {
        const action = setSearchTerm('nonexistent')
        const newState = iconsReducer(initialTestState, action)
        
        expect(newState.filteredIcons).toHaveLength(0)
      })
    })

    describe('setSelectedCategory', () => {
      it('should set the selected category and trigger filtering', () => {
        const action = setSelectedCategory('test-category')
        const newState = iconsReducer(initialTestState, action)
        
        expect(newState.selectedCategory).toBe('test-category')
        expect(newState.filteredIcons).toHaveLength(2)
        expect(newState.filteredIcons).toContain(mockIcon1)
        expect(newState.filteredIcons).toContain(mockIcon3)
      })

      it('should handle "All" category selection', () => {
        const stateWithCategory = { ...initialTestState, selectedCategory: 'test-category' }
        const action = setSelectedCategory('All')
        const newState = iconsReducer(stateWithCategory, action)
        
        expect(newState.selectedCategory).toBe('All')
        expect(newState.filteredIcons).toEqual(mockIcons)
      })

      it('should handle category with no icons', () => {
        const action = setSelectedCategory('empty-category')
        const newState = iconsReducer(initialTestState, action)
        
        expect(newState.filteredIcons).toHaveLength(0)
      })
    })

    describe('filterIcons', () => {
      it('should filter by both search term and category', () => {
        const stateWithBothFilters = {
          ...initialTestState,
          searchTerm: 'test',
          selectedCategory: 'test-category'
        }
        
        const action = filterIcons()
        const newState = iconsReducer(stateWithBothFilters, action)
        
        expect(newState.filteredIcons).toHaveLength(2)
        expect(newState.filteredIcons).toContain(mockIcon1)
        expect(newState.filteredIcons).toContain(mockIcon3)
      })

      it('should return empty array when filters match nothing', () => {
        const stateWithNoMatches = {
          ...initialTestState,
          searchTerm: 'nonexistent',
          selectedCategory: 'empty-category'
        }
        
        const action = filterIcons()
        const newState = iconsReducer(stateWithNoMatches, action)
        
        expect(newState.filteredIcons).toHaveLength(0)
      })

      it('should handle partial matches in search', () => {
        const stateWithPartial = {
          ...initialTestState,
          searchTerm: 'icon'
        }
        
        const action = filterIcons()
        const newState = iconsReducer(stateWithPartial, action)
        
        expect(newState.filteredIcons).toHaveLength(2)
        expect(newState.filteredIcons).toContain(mockIcon1)
        expect(newState.filteredIcons).toContain(mockIcon2)
      })
    })

    describe('setLoading', () => {
      it('should set loading state to true', () => {
        const action = setLoading(true)
        const newState = iconsReducer(initialTestState, action)
        
        expect(newState.loading).toBe(true)
      })

      it('should set loading state to false', () => {
        const stateWithLoading = { ...initialTestState, loading: true }
        const action = setLoading(false)
        const newState = iconsReducer(stateWithLoading, action)
        
        expect(newState.loading).toBe(false)
      })

      it('should not affect other state properties', () => {
        const action = setLoading(true)
        const newState = iconsReducer(initialTestState, action)
        
        expect(newState.allIcons).toEqual(initialTestState.allIcons)
        expect(newState.selectedIcon).toEqual(initialTestState.selectedIcon)
        expect(newState.searchTerm).toEqual(initialTestState.searchTerm)
      })
    })
  })

  describe('complex scenarios', () => {
    it('should handle multiple filter operations correctly', () => {
      let state = initialTestState

      // Set category filter
      state = iconsReducer(state, setSelectedCategory('test-category'))
      expect(state.filteredIcons).toHaveLength(2)

      // Add search filter
      state = iconsReducer(state, setSearchTerm('test-icon'))
      expect(state.filteredIcons).toHaveLength(1)
      expect(state.filteredIcons[0]).toEqual(mockIcon1)

      // Clear search
      state = iconsReducer(state, setSearchTerm(''))
      expect(state.filteredIcons).toHaveLength(2)

      // Clear category
      state = iconsReducer(state, setSelectedCategory('All'))
      expect(state.filteredIcons).toEqual(mockIcons)
    })

    it('should maintain state consistency during rapid changes', () => {
      let state = initialTestState

      // Rapid state changes
      state = iconsReducer(state, setSelectedIcon(mockIcon1))
      state = iconsReducer(state, setSearchTerm('test'))
      state = iconsReducer(state, setSelectedCategory('test-category'))
      state = iconsReducer(state, setLoading(true))

      expect(state.selectedIcon).toEqual(mockIcon1)
      expect(state.searchTerm).toBe('test')
      expect(state.selectedCategory).toBe('test-category')
      expect(state.loading).toBe(true)
      expect(state.filteredIcons).toHaveLength(2)
    })

    it('should handle edge case with empty allIcons array', () => {
      const emptyState = { ...initialTestState, allIcons: [], filteredIcons: [] }
      
      const action = setSearchTerm('test')
      const newState = iconsReducer(emptyState, action)
      
      expect(newState.filteredIcons).toHaveLength(0)
      expect(newState.searchTerm).toBe('test')
    })
  })

  describe('initial state', () => {
    it('should return the initial state when called with undefined state', () => {
      const action = { type: 'unknown' }
      const state = iconsReducer(undefined, action as any)
      
      expect(state).toBeDefined()
      expect(state.selectedIcon).toBeNull()
      expect(state.searchTerm).toBe('')
      expect(state.selectedCategory).toBe('All')
      expect(state.loading).toBe(false)
    })
  })

  describe('action creators', () => {
    it('should create correct action for setSelectedIcon', () => {
      const action = setSelectedIcon(mockIcon1)
      
      expect(action.type).toBe('icons/setSelectedIcon')
      expect(action.payload).toEqual(mockIcon1)
    })

    it('should create correct action for setSearchTerm', () => {
      const action = setSearchTerm('test-search')
      
      expect(action.type).toBe('icons/setSearchTerm')
      expect(action.payload).toBe('test-search')
    })

    it('should create correct action for setSelectedCategory', () => {
      const action = setSelectedCategory('test-category')
      
      expect(action.type).toBe('icons/setSelectedCategory')
      expect(action.payload).toBe('test-category')
    })

    it('should create correct action for setLoading', () => {
      const action = setLoading(true)
      
      expect(action.type).toBe('icons/setLoading')
      expect(action.payload).toBe(true)
    })
  })
})
