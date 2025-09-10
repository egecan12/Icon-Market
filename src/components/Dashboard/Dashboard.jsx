import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
    setSelectedIcon, 
    setSearchTerm, 
    setSelectedCategory,
    selectFilteredIcons,
    selectSelectedIcon,
    selectSearchTerm,
    selectSelectedCategory,
    selectCategories,
    selectLoading,
    selectHasError,
    clearError,
    handleError
} from '../../store/iconsSlice'
import IconList from '../IconList';
import IconDetail from '../IconDetail';
import SearchBar from '../SearchBar';
import CategoryFilter from '../CategoryFilter';
import './Dashboard.css';

export default function Dashboard() {
    const dispatch = useDispatch();
    const filteredIcons = useSelector(selectFilteredIcons);
    const selectedIcon = useSelector(selectSelectedIcon);
    const searchTerm = useSelector(selectSearchTerm);
    const selectedCategory = useSelector(selectSelectedCategory);
    const categories = useSelector(selectCategories);
    const loading = useSelector(selectLoading);
    const hasError = useSelector(selectHasError);

    const handleIconClick = (icon) => {
        dispatch(setSelectedIcon(icon));
    };

    const handleSearchChange = (term) => {
        dispatch(setSearchTerm(term));
    };

    const handleCategoryChange = (category) => {
        dispatch(setSelectedCategory(category));
    };

    // Error handling functions
    const handleClearError = () => {
        dispatch(clearError());
    };

    return (
        <div className="main-layout">
            {/* Top Controls Bar */}
            <div className="controls-bar card">
                <div className="controls-left">
                    <SearchBar 
                        searchTerm={searchTerm} 
                        onSearchChange={handleSearchChange} 
                    />
                    <CategoryFilter 
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                    />
                </div>
                <div className="controls-right">
                    <div className="stats-info">
                        {filteredIcons.length} icons found
                    </div>
                    {hasError && (
                        <button 
                            className="clear-error-btn"
                            onClick={handleClearError}
                            title="Clear Error"
                        >
                            Clear Error
                        </button>
                    )}
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
                            onIconClick={handleIconClick}
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
