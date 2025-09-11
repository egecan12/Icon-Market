import { describe, it, expect, beforeEach } from 'vitest';
import iconsReducer, {
  setSelectedIcon,
  setSearchTerm,
  setSelectedCategory,
  filterIcons,
  setLoading,
  selectAllIcons,
  selectFilteredIcons,
  selectSelectedIcon,
  selectSearchTerm,
  selectSelectedCategory,
  selectCategories,
  selectLoading
} from '../iconsSlice';
import { IconsState, Icon } from '../../types';

// Mock data for testing
const mockIcons: Icon[] = [
  { name: 'home', category: 'interface', svg: '<svg>home</svg>' },
  { name: 'user', category: 'interface', svg: '<svg>user</svg>' },
  { name: 'bell', category: 'notification', svg: '<svg>bell</svg>' },
  { name: 'mail', category: 'notification', svg: '<svg>mail</svg>' },
  { name: 'search', category: 'action', svg: '<svg>search</svg>' }
];

const mockInitialState: IconsState = {
  allIcons: mockIcons,
  filteredIcons: mockIcons,
  selectedIcon: null,
  searchTerm: '',
  selectedCategory: 'All',
  categories: ['All', 'interface', 'notification', 'action'],
  loading: false
};

describe('Icons Slice', () => {
  let initialState: IconsState;

  beforeEach(() => {
    initialState = { ...mockInitialState };
  });

  describe('Initial State', () => {
    it('should return the initial state correctly', () => {
      const result = iconsReducer(undefined, { type: '@@INIT' });
      
      expect(result).toHaveProperty('allIcons');
      expect(result).toHaveProperty('filteredIcons');
      expect(result.selectedIcon).toBeNull();
      expect(result.searchTerm).toBe('');
      expect(result.selectedCategory).toBe('All');
      expect(result.loading).toBe(false);
      expect(Array.isArray(result.categories)).toBe(true);
    });
  });

  describe('setSelectedIcon', () => {
    it('should set the selected icon', () => {
      const targetIcon = mockIcons[0];
      const action = setSelectedIcon(targetIcon);
      const result = iconsReducer(initialState, action);

      expect(result.selectedIcon).toEqual(targetIcon);
    });

    it('should clear the selected icon when null is passed', () => {
      const stateWithSelection = { ...initialState, selectedIcon: mockIcons[0] };
      const action = setSelectedIcon(null);
      const result = iconsReducer(stateWithSelection, action);

      expect(result.selectedIcon).toBeNull();
    });
  });

  describe('setSearchTerm', () => {
    it('should update search term and trigger filtering', () => {
      const action = setSearchTerm('home');
      const result = iconsReducer(initialState, action);

      expect(result.searchTerm).toBe('home');
      expect(result.filteredIcons).toHaveLength(1);
      expect(result.filteredIcons[0].name).toBe('home');
    });

    it('should be case insensitive', () => {
      const action = setSearchTerm('HOME');
      const result = iconsReducer(initialState, action);

      expect(result.filteredIcons).toHaveLength(1);
      expect(result.filteredIcons[0].name).toBe('home');
    });

    it('should handle partial matches', () => {
      const action = setSearchTerm('ma'); // should match 'mail'
      const result = iconsReducer(initialState, action);

      expect(result.filteredIcons).toHaveLength(1);
      expect(result.filteredIcons[0].name).toBe('mail');
    });

    it('should return empty array when no matches found', () => {
      const action = setSearchTerm('nonexistent');
      const result = iconsReducer(initialState, action);

      expect(result.filteredIcons).toHaveLength(0);
    });

    it('should clear search and show all icons when empty string', () => {
      const stateWithSearch = { ...initialState, searchTerm: 'home', filteredIcons: [mockIcons[0]] };
      const action = setSearchTerm('');
      const result = iconsReducer(stateWithSearch, action);

      expect(result.searchTerm).toBe('');
      expect(result.filteredIcons).toHaveLength(mockIcons.length);
    });
  });

  describe('setSelectedCategory', () => {
    it('should update selected category and trigger filtering', () => {
      const action = setSelectedCategory('interface');
      const result = iconsReducer(initialState, action);

      expect(result.selectedCategory).toBe('interface');
      expect(result.filteredIcons).toHaveLength(2); // home, user
      expect(result.filteredIcons.every(icon => icon.category === 'interface')).toBe(true);
    });

    it('should show all icons when "All" category is selected', () => {
      const stateWithCategory = { ...initialState, selectedCategory: 'interface', filteredIcons: [mockIcons[0]] };
      const action = setSelectedCategory('All');
      const result = iconsReducer(stateWithCategory, action);

      expect(result.selectedCategory).toBe('All');
      expect(result.filteredIcons).toHaveLength(mockIcons.length);
    });

    it('should combine with existing search term', () => {
      const stateWithSearch = { ...initialState, searchTerm: 'e' }; // matches 'home', 'user', 'bell', 'search'
      const action = setSelectedCategory('interface');
      const result = iconsReducer(stateWithSearch, action);

      expect(result.filteredIcons).toHaveLength(2); // 'home', 'user'
      expect(result.filteredIcons.every(icon => 
        icon.category === 'interface' && icon.name.includes('e')
      )).toBe(true);
    });
  });

  describe('filterIcons', () => {
    it('should filter by search term only', () => {
      const stateWithSearch = { ...initialState, searchTerm: 'bell' };
      const action = filterIcons();
      const result = iconsReducer(stateWithSearch, action);

      expect(result.filteredIcons).toHaveLength(1);
      expect(result.filteredIcons[0].name).toBe('bell');
    });

    it('should filter by category only', () => {
      const stateWithCategory = { ...initialState, selectedCategory: 'notification' };
      const action = filterIcons();
      const result = iconsReducer(stateWithCategory, action);

      expect(result.filteredIcons).toHaveLength(2); // bell, mail
      expect(result.filteredIcons.every(icon => icon.category === 'notification')).toBe(true);
    });

    it('should filter by both search term and category', () => {
      const stateWithBoth = {
        ...initialState,
        searchTerm: 'ma',
        selectedCategory: 'notification'
      };
      const action = filterIcons();
      const result = iconsReducer(stateWithBoth, action);

      expect(result.filteredIcons).toHaveLength(1);
      expect(result.filteredIcons[0].name).toBe('mail');
    });

    it('should return all icons when no filters applied', () => {
      const action = filterIcons();
      const result = iconsReducer(initialState, action);

      expect(result.filteredIcons).toHaveLength(mockIcons.length);
    });
  });

  describe('setLoading', () => {
    it('should set loading to true', () => {
      const action = setLoading(true);
      const result = iconsReducer(initialState, action);

      expect(result.loading).toBe(true);
    });

    it('should set loading to false', () => {
      const stateWithLoading = { ...initialState, loading: true };
      const action = setLoading(false);
      const result = iconsReducer(stateWithLoading, action);

      expect(result.loading).toBe(false);
    });
  });

  describe('Selectors', () => {
    const mockRootState = {
      icons: mockInitialState,
      error: { error: null, hasError: false, errorType: null, timestamp: null }
    };

    it('should select all icons', () => {
      const result = selectAllIcons(mockRootState);
      expect(result).toEqual(mockIcons);
    });

    it('should select filtered icons', () => {
      const result = selectFilteredIcons(mockRootState);
      expect(result).toEqual(mockIcons);
    });

    it('should select selected icon', () => {
      const result = selectSelectedIcon(mockRootState);
      expect(result).toBeNull();
    });

    it('should select search term', () => {
      const result = selectSearchTerm(mockRootState);
      expect(result).toBe('');
    });

    it('should select selected category', () => {
      const result = selectSelectedCategory(mockRootState);
      expect(result).toBe('All');
    });

    it('should select categories', () => {
      const result = selectCategories(mockRootState);
      expect(result).toEqual(['All', 'interface', 'notification', 'action']);
    });

    it('should select loading state', () => {
      const result = selectLoading(mockRootState);
      expect(result).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty allIcons array', () => {
      const emptyState = { ...initialState, allIcons: [], filteredIcons: [] };
      const action = setSearchTerm('test');
      const result = iconsReducer(emptyState, action);

      expect(result.filteredIcons).toHaveLength(0);
    });

    it('should handle special characters in search', () => {
      const specialIcon = { name: 'icon-with-dash', category: 'special', svg: '<svg/>' };
      const stateWithSpecial = {
        ...initialState,
        allIcons: [...mockIcons, specialIcon],
        filteredIcons: [...mockIcons, specialIcon]
      };
      
      const action = setSearchTerm('dash');
      const result = iconsReducer(stateWithSpecial, action);

      expect(result.filteredIcons).toHaveLength(1);
      expect(result.filteredIcons[0].name).toBe('icon-with-dash');
    });

    it('should maintain other state properties when filtering', () => {
      const stateWithData = {
        ...initialState,
        selectedIcon: mockIcons[0],
        loading: true
      };
      
      const action = setSearchTerm('bell');
      const result = iconsReducer(stateWithData, action);

      expect(result.selectedIcon).toEqual(mockIcons[0]);
      expect(result.loading).toBe(true);
      expect(result.allIcons).toEqual(mockIcons);
    });
  });
});
