import React, { useState } from 'react'
import iconsData from '../data/icon-index.json'
import IconList from './IconList';
import IconDetail from './IconDetail';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';

export default function IconLibrary() {

    const [selectedIcon, setSelectedIcon] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['All', ...Array.from(new Set(iconsData.map(icon => icon.category)))];

    const filteredIcons = iconsData.filter(icon => {
        const matchesCategory = selectedCategory === "All" || icon.category === selectedCategory;
        const matchesSearch = icon.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="main-layout">
            {/* Top Controls Bar */}
            <div className="controls-bar card">
                <div className="controls-left">
                    <SearchBar 
                        searchTerm={searchTerm} 
                        onSearchChange={setSearchTerm} 
                    />
                    <CategoryFilter 
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                    />
                </div>
                <div className="controls-right">
                    <div className="stats-info">
                        {filteredIcons.length} icons found
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="content-area">
                {/* Icons Grid Section */}
                <div className="icons-section card">
                    <div className="icon-list-container">
                        <IconList
                            icons={filteredIcons}
                            selectedIcon={selectedIcon}
                            onIconClick={setSelectedIcon}
                        />
                    </div>
                </div>
                {/* Icon Detail Panel */}
                <div className="detail-section card">
                    <IconDetail icon={selectedIcon} />
                </div>
            </div>
        </div>
    )
}
