import { useDispatch } from 'react-redux';
import { setError } from '../../store/errorSlice';
import type { IconListProps } from '../../types';
import IconItem from "../IconItem";
import './IconList.css';

export default function IconList({ icons, selectedIcon, onIconClick }: IconListProps) {
  const dispatch = useDispatch();
  
  // Validation and error handling for props
  try {
    if (!icons) {
      throw new Error("No icon data available");
    }

    if (!Array.isArray(icons)) {
      throw new Error("Invalid icon data format");
    }

    icons.forEach(icon => {
      if (!icon || typeof icon !== 'object') {
        throw new Error("Invalid icon object in data");
      }
      if (!icon.name || !icon.category) {
        throw new Error("Missing required icon properties");
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    dispatch(setError({ 
      message: errorMessage,
      type: 'validation'
    }));
    return (
      <div className="error-state">
        <h3>Data Error</h3>
        <p>{errorMessage}</p>
        <p>Please try refreshing the page or contact support if the issue persists.</p>
      </div>
    );
  }

  if (icons.length === 0) {
    return (
      <div className="empty-state">
        <h3>No icons found</h3>
        <p>Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  try {
    return (
      <div className="icon-grid">
        {icons.map((icon, index) => {
          // Validate icon data structure
          if (!icon || !icon.name) {
            console.warn(`Invalid icon data at index ${index}:`, icon);
            return null;
          }

          return (
            <IconItem
              key={icon.name}
              icon={icon}
              isSelected={Boolean(selectedIcon && selectedIcon.name === icon.name)}
              onClick={() => onIconClick(icon)}
            />
          );
        })}
      </div>
    );
  } catch (error) {
    console.error('Error rendering icon list:', error);
    return (
      <div className="error-state">
        <h3>Rendering Error</h3>
        <p>There was an error displaying the icons. Please try again.</p>
      </div>
    );
  }
}
