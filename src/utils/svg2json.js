import fs from 'fs';
import path from 'path';

/**
 * Converts SVG files from a directory structure to JSON format
 * @param {string} rootPath - Root directory containing category folders with SVG files
 * @returns {Array} Array of icon objects with name, category, and svg content
 */
export function convertSvgToJson(rootPath) {
  if (!fs.existsSync(rootPath)) {
    throw new Error(`Root path does not exist: ${rootPath}`);
  }

  const categories = fs.readdirSync(rootPath);
  let iconList = [];

  categories.forEach(category => {
    const categoryPath = path.join(rootPath, category);
    
    // Skip files, only process directories
    if (!fs.statSync(categoryPath).isDirectory()) {
      return;
    }

    const files = fs.readdirSync(categoryPath);
    files.forEach(file => {
      if (file.endsWith('.svg')) {
        try {
          const svgContent = fs.readFileSync(path.join(categoryPath, file), 'utf8');
          iconList.push({
            name: file.replace('.svg', ''),
            category: category,
            svg: svgContent.trim()
          });
        } catch (error) {
          console.warn(`Failed to read SVG file: ${file}`, error.message);
        }
      }
    });
  });

  return iconList;
}

/**
 * Saves icon data to JSON file
 * @param {Array} iconData - Array of icon objects
 * @param {string} outputPath - Path where to save the JSON file
 */
export function saveIconsToJson(iconData, outputPath) {
  if (!Array.isArray(iconData)) {
    throw new Error('Icon data must be an array');
  }

  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(iconData, null, 2));
}

/**
 * Main function to convert SVG directory to JSON file
 * @param {string} rootPath - Root directory containing SVG files
 * @param {string} outputPath - Output JSON file path
 */
export function processSvgToJson(rootPath = '../../../package/assets/icons', outputPath = './src/data/icon-index.json') {
  try {
    console.log("current dir:", import.meta.url);
    const iconData = convertSvgToJson(rootPath);
    saveIconsToJson(iconData, outputPath);
    console.log(`Successfully processed ${iconData.length} icons to ${outputPath}`);
    return iconData;
  } catch (error) {
    console.error('Error processing SVG to JSON:', error.message);
    throw error;
  }
}

// If running directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  processSvgToJson();
}
