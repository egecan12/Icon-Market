import React from 'react'

export default function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="search-section">
      <div className="search-container">
        <div className="search-icon">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input 
          type="text"
          className="search-input"
          placeholder="Search icons by name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  )
}
