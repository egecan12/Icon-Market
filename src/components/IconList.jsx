import React from 'react'
import IconItem from "./IconItem";

export default function IconList({icons, selectedIcon, onIconClick}) {
// This onClick handler calls the onIconClick function when user clicks on an icon
  return (
    <div className="icon-list" style={{ width: "300px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {icons.map(icon => (
            <IconItem
                key={icon.name}
                icon={icon}
                isSelected={selectedIcon && selectedIcon.name === icon.name}
                onClick={() => {onIconClick(icon)}}
   
            />
        ))}
    </div>
  )
}