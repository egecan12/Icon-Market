// Icon types
export interface Icon {
  name: string;
  category: string;
  svg?: string;
  path?: string;
}

// Redux state types
export interface IconsState {
  allIcons: Icon[];
  filteredIcons: Icon[];
  selectedIcon: Icon | null;
  searchTerm: string;
  selectedCategory: string;
  categories: string[];
  loading: boolean;
}

export interface ErrorState {
  error: string | null;
  hasError: boolean;
  errorType: string | null;
  timestamp: string | null;
}

export interface RootState {
  icons: IconsState;
  error: ErrorState;
}

// Component prop types
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

// Error types
export interface ErrorPayload {
  message: string;
  type?: 'validation' | 'network' | 'data' | 'general';
}
