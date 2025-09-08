import React from 'react'

export default function CategoryFilter({ categories, selected, setSelected }) {
  return (
    <select selected={selected} onClick={e => setSelected(e.target.value)}>
      {categories.map(cat =>
        (<option key={cat} value={cat}>{cat}</option>)
      )}
    </select>
  )
}
