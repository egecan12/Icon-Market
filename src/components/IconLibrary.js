import React, { useState } from 'react'
import iconsData from '../data/icon-index.json'
import IconList from './IconList';
import IconDetail from './IconDetail';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';

export default function iconLibrary() {

const [selectedIcon, setSelectedIcon ] = useState('');
const [selectedCategory, setSelectedCategory ] = useState('');
const [searchTerm, setSearchTerm] = useState('');

const categories = ['All', ...Array.from(new Set(iconsData.map(icon => icon.category)))];

const filteredIcons = iconsData.filter(icon => {
    const matchedCategory = selectedCategory === 'All' || selectedCategory === icon.category
    const matchesSearch = icon.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchedCategory && matchesSearch
})

  return (
    <div>iconLibrary
        console.log(iconsData)
    </div>
  )
}
