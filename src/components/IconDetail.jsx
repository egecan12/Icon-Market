import React from "react";
import DOMPurify from 'dompurify';

function IconDetail({ icon }) {
  if (!icon) return (
    <div style={{ marginLeft: "2rem" }}>
      <h3>Select an Icon</h3>
    </div>
  );

  // Copy name
  const handleCopy = () => {
    navigator.clipboard.writeText(icon.name);
    alert("Icon name has been copied!");
  };

  // SVG download
  const handleDownload = () => {
    const blob = new Blob([icon.svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${icon.name}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ marginLeft: "2rem", minWidth: "200px" }}>
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(icon.svg) }} style={{ width: 64, height: 64 }} />
      <h2>{icon.name}</h2>
      <button onClick={handleCopy}>Copy the name</button>
      <button onClick={handleDownload}>SVG Download</button>
      <div>
        <strong>Category:</strong> {icon.category}
      </div>
      <div>
      <strong>Keywords:</strong> {Array.isArray(icon.keywords) ? icon.keywords.join(", ") : "No keywords available"}
      </div>
    </div>
  );
}

export default IconDetail;