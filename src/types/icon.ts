/**
 * Icon-related type definitions
 * Contains all types related to icon data structure and operations
 */

export interface Icon {
  name: string;
  category: string;
  svg?: string;
  path?: string;
}

export interface IconsState {
  allIcons: Icon[];
  filteredIcons: Icon[];
  selectedIcon: Icon | null;
  searchTerm: string;
  selectedCategory: string;
  categories: string[];
  loading: boolean;
}
