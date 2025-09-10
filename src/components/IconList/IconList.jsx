import React from 'react'
import IconItem from "../IconItem";
import './IconList.css';

export default function IconList({ icons, selectedIcon, onIconClick }) {
  // Error handling for invalid props
  if (!icons) {
    return (
      <div className="error-state">
        <h3>Unable to load icons</h3>
        <p>There was an error loading the icon data. Please try refreshing the page.</p>
      </div>
    );
  }

  if (!Array.isArray(icons)) {
    return (
      <div className="error-state">
        <h3>Invalid icon data</h3>
        <p>The icon data format is invalid. Please contact support.</p>
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
              isSelected={selectedIcon && selectedIcon.name === icon.name}
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
