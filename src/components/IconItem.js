import React from 'react'
import DOMPurify from 'dompurify'

export default function IconItem(icon, isSelected, onClick) {
  return (
    <div
      className={`icon-item${isSelected ? " selected" : ""}`}
      style={{
        border: isSelected ? "2px solid #007aff" : "1px solid #ccc",
        borderRadius: "8px",
        padding: "8px",
        cursor: "pointer",
        background: isSelected ? "#f0f6ff" : "white"
      }}
      onClick={onClick}
    >
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(icon.svg) }} />
      <span>{icon.name}</span>
    </div>
  );
}
