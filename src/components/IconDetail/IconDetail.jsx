import React, { useState } from "react";
import DOMPurify from 'dompurify';
import './IconDetail.css';

function IconDetail({ icon }) {
  const [copied, setCopied] = useState(false);
  const [SVGCopied, setSVGCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!icon) {
    return (
      <div className="icon-detail-empty">
        <div className="empty-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <h3>Select an Icon</h3>
        <p>Choose an icon from the grid to view details and download options</p>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(icon.name);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("Failed to copy icon name");
    }
  };

  const handleCopySVG = async () => {
    try {
      await navigator.clipboard.writeText(icon.svg);
      setSVGCopied(true);
      setTimeout(() => setSVGCopied(false), 2000);
    } catch (err) {
      alert("Failed to copy SVG code");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([icon.svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${icon.name}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="icon-detail-content">
      {/* Header Section */}
      <div className="icon-detail-header">
        <div className="icon-detail-preview">
          <div className="icon-preview-bg">
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(icon.svg) }} />
          </div>
        </div>
        <div className="icon-detail-info">
          <h2 className="icon-detail-title">{icon.name}</h2>
          <span className="icon-detail-category">{icon.category}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="icon-quick-actions">
        <button 
          onClick={handleCopy} 
          className={`quick-action-btn ${copied ? 'success' : ''}`}
          title="Copy icon name"
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/>
          </svg>
          {copied ? 'Copied!' : 'Copy Name'}
        </button>
        
        <button 
          onClick={handleCopySVG} 
          className={`quick-action-btn ${SVGCopied ? 'success' : ''}`}
          title="Copy SVG code"
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
          {SVGCopied ? 'Copied!' : 'Copy SVG'}
        </button>
        
        <button 
          onClick={handleDownload} 
          className={`quick-action-btn primary ${downloaded ? 'success' : ''}`}
          title="Download SVG file"
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
          {downloaded ? 'Downloaded!' : 'Download'}
        </button>
      </div>

  
    </div>
  );
}

export default IconDetail;
