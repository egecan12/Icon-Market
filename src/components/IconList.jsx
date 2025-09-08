import React from 'react'
import IconItem from "./IconItem";

export default function IconList({ icons, selectedIcon, onIconClick }) {
  if (!icons || icons.length === 0) {
    return (
      <div className="empty-state">
        <h3>No icons found</h3>
        <p>Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="icon-grid">
      {icons.map(icon => (
        <IconItem
          key={icon.name}
          icon={icon}
          isSelected={selectedIcon && selectedIcon.name === icon.name}
          onClick={() => onIconClick(icon)}
        />
      ))}
    </div>
  )
}