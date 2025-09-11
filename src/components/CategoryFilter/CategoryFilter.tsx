import type { CategoryFilterProps } from '../../types';
import './CategoryFilter.css'

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="category-filter">
      <label htmlFor="category-select">Category</label>
      <select 
        id="category-select"
        className="category-select"
        value={selectedCategory} 
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  )
}
