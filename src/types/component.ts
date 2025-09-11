/**
 * Component prop type definitions
 * Contains all interface definitions for React component props
 */

import { Icon } from './icon';

export interface IconItemProps {
  icon: Icon;
  isSelected: boolean;
  onClick: (icon: Icon) => void;
}

export interface IconListProps {
  icons: Icon[];
  selectedIcon: Icon | null;
  onIconClick: (icon: Icon) => void;
}

export interface IconDetailProps {
  icon: Icon | null;
}

export interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}
