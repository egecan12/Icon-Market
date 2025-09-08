import React, { useState } from 'react'
import iconsData from '../data/icon-index.json'
import IconList from './IconList';
import IconDetail from './IconDetail';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import IconItem from './IconItem';

export default function IconLibrary() {

    const [selectedIcon, setSelectedIcon] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['All', ...Array.from(new Set(iconsData.map(icon => icon.category)))];

    const filteredIcons = iconsData.filter(icon => {
        const matchesCategory = selectedCategory === "All" || icon.category === selectedCategory;
        const matchesSearch = icon.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch
    })
    console.log(filteredIcons)
    console.log(iconsData)

    return (
        <div style={{ display: "flex", marginTop: "2rem" }}>
        <IconList
          icons={filteredIcons}
          selectedIcon={selectedIcon}
          onIconClick={setSelectedIcon}
        />
        <IconDetail icon={selectedIcon} />
      </div>
    )
}
