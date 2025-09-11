import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../../store/store'
import type { Icon } from '../../types'
import { 
    setSelectedIcon, 
    setSearchTerm, 
    setSelectedCategory,
    selectFilteredIcons,
    selectSelectedIcon,
    selectSearchTerm,
    selectSelectedCategory,
    selectCategories
} from '../../store/iconsSlice'
import {
    selectHasError,
    clearError
} from '../../store/errorSlice'
import IconList from '../IconList';
import IconDetail from '../IconDetail';
import SearchBar from '../SearchBar';
import CategoryFilter from '../CategoryFilter';
import './Dashboard.css';

export default function Dashboard() {
    const dispatch = useDispatch<AppDispatch>();
    const filteredIcons = useSelector((state: RootState) => selectFilteredIcons(state));
    const selectedIcon = useSelector((state: RootState) => selectSelectedIcon(state));
    const searchTerm = useSelector((state: RootState) => selectSearchTerm(state));
    const selectedCategory = useSelector((state: RootState) => selectSelectedCategory(state));
    const categories = useSelector((state: RootState) => selectCategories(state));
    // const loading = useSelector((state: RootState) => selectLoading(state));
    const hasError = useSelector((state: RootState) => selectHasError(state));

    const handleIconClick = (icon: Icon) => {
        dispatch(setSelectedIcon(icon));
    };

    const handleSearchChange = (term: string) => {
        dispatch(setSearchTerm(term));
    };

    const handleCategoryChange = (category: string) => {
        dispatch(setSelectedCategory(category));
    };

    // Error handling functions
    const handleClearError = () => {
        dispatch(clearError());
    };

    // Error handling for data operations in case of needed in future
    // const handleDataError = (error: Error) => {
    //     dispatch(setError({
    //         message: error.message,
    //         type: 'data'
    //     }));
    // };

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
