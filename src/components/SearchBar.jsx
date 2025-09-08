import React from 'react'

export default function SearchBar({searchTerm, setSearchTerm}) {
  return (
    <input
    type='text'
    value={searchTerm}
    placeholder='search..'
    onClick={e => setSearchTerm(e.target.setSearchTerm)}
   />
  )
}
