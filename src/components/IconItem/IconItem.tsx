import DOMPurify from 'dompurify'
import type { IconItemProps } from '../../types';
import './IconItem.css'

export default function IconItem({ icon, isSelected, onClick }: IconItemProps) {
  return (
    <div
      className={`icon-item${isSelected ? " selected" : ""}`}
      onClick={() => onClick(icon)}
    >
      <div className="icon-display">
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(icon.svg || '') }} />
      </div>
      <span className="icon-name">{icon.name}</span>
    </div>
  );
}
