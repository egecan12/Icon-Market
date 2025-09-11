import fs from 'fs';

export function formatCategoryName(category) {
  if (!category || typeof category !== 'string') {
    return '';
  }

  return category
    .replace(/__/g, ' ')
    .replace(/_/g, ' ')
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function formatIconCategories(inputPath = './src/data/icon-index.json', outputPath = null) {
  try {
    const iconData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    
    if (!Array.isArray(iconData)) {
      throw new Error('Icon data must be an array');
    }

    const originalCategories = [...new Set(iconData.map(icon => icon.category))];
    const categoryMapping = originalCategories.map(cat => ({
      original: cat,
      formatted: formatCategoryName(cat)
    }));

    const updatedIconData = iconData.map(icon => ({
      ...icon,
      category: formatCategoryName(icon.category)
    }));

    const targetPath = outputPath || inputPath;
    fs.writeFileSync(targetPath, JSON.stringify(updatedIconData, null, 2));

    return {
      success: true,
      iconsUpdated: iconData.length,
      categoriesFormatted: originalCategories.length,
      categoryMapping,
      filePath: targetPath
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

export function previewCategoryFormatting(inputPath = './src/data/icon-index.json') {
  try {
    const iconData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    const originalCategories = [...new Set(iconData.map(icon => icon.category))];
    
    const preview = originalCategories.map(cat => ({
      original: cat,
      formatted: formatCategoryName(cat),
      changed: cat !== formatCategoryName(cat)
    }));

    return {
      success: true,
      totalCategories: originalCategories.length,
      categoriesNeedingFormat: preview.filter(p => p.changed).length,
      preview
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2] || 'format';
  const inputPath = process.argv[3] || './src/data/icon-index.json';
  
  switch (command) {
    case 'preview': {
      const previewResult = previewCategoryFormatting(inputPath);
      if (previewResult.success) {
        console.log('Category Formatting Preview:');
        console.log(`Total categories: ${previewResult.totalCategories}`);
        console.log(`Need formatting: ${previewResult.categoriesNeedingFormat}`);
        console.log('\nChanges:');
        previewResult.preview.forEach(cat => {
          if (cat.changed) {
            console.log(`  "${cat.original}" -> "${cat.formatted}"`);
          } else {
            console.log(`  "${cat.original}" (no change)`);
          }
        });
      } else {
        console.error('Error:', previewResult.error);
      }
      break;
    }
      
    case 'format':
    default: {
      const formatResult = formatIconCategories(inputPath);
      if (formatResult.success) {
        console.log('Category formatting completed');
        console.log(`Updated ${formatResult.iconsUpdated} icons`);
        console.log(`Formatted ${formatResult.categoriesFormatted} categories`);
        console.log('File:', formatResult.filePath);
        console.log('\nCategory mappings:');
        formatResult.categoryMapping.forEach(cat => {
          console.log(`  "${cat.original}" -> "${cat.formatted}"`);
        });
      } else {
        console.error('Error:', formatResult.error);
      }
      break;
    }
  }
}
