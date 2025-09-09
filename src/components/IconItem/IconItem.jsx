import React from 'react'
import DOMPurify from 'dompurify'
import './IconItem.css'

export default function IconItem({ icon, isSelected, onClick }) {
  return (
    <div
      className={`icon-item${isSelected ? " selected" : ""}`}
      onClick={onClick}
    >
      <div className="icon-display">
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(icon.svg) }} />
      </div>
      <span className="icon-name">{icon.name}</span>
    </div>
  );
}
