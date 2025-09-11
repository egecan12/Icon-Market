import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import { formatCategoryName, formatIconCategories, previewCategoryFormatting } from '../category-formatter.js';

vi.mock('fs');

describe('Category Formatter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('formatCategoryName', () => {
    it('should format category names with double underscores', () => {
      expect(formatCategoryName('action__interface')).toBe('Action Interface');
      expect(formatCategoryName('business__statistics')).toBe('Business Statistics');
    });

    it('should format category names with single underscores', () => {
      expect(formatCategoryName('user_interface')).toBe('User Interface');
      expect(formatCategoryName('data_visualization')).toBe('Data Visualization');
    });

    it('should format mixed case properly', () => {
      expect(formatCategoryName('ACTION__interface')).toBe('Action Interface');
      expect(formatCategoryName('BUSINESS_statistics')).toBe('Business Statistics');
    });

    it('should handle single words', () => {
      expect(formatCategoryName('arrows')).toBe('Arrows');
      expect(formatCategoryName('icons')).toBe('Icons');
    });

    it('should handle edge cases', () => {
      expect(formatCategoryName('')).toBe('');
      expect(formatCategoryName(null)).toBe('');
      expect(formatCategoryName(undefined)).toBe('');
      expect(formatCategoryName('  multiple  spaces  ')).toBe('Multiple Spaces');
    });

    it('should handle special characters', () => {
      expect(formatCategoryName('test__with-dash')).toBe('Test With-dash');
      expect(formatCategoryName('category_with.dot')).toBe('Category With.dot');
    });
  });

  describe('formatIconCategories', () => {
    const mockIconData = [
      { name: 'home', category: 'action__interface', svg: '<svg>home</svg>' },
      { name: 'arrow', category: 'arrows', svg: '<svg>arrow</svg>' },
      { name: 'chart', category: 'business__statistics', svg: '<svg>chart</svg>' }
    ];

    it('should format categories in icon data successfully', () => {
      fs.readFileSync.mockReturnValue(JSON.stringify(mockIconData));
      fs.writeFileSync.mockImplementation(() => {});

      const result = formatIconCategories('./test.json');

      expect(result.success).toBe(true);
      expect(result.iconsUpdated).toBe(3);
      expect(result.categoriesFormatted).toBe(3);
      expect(result.categoryMapping).toEqual([
        { original: 'action__interface', formatted: 'Action Interface' },
        { original: 'arrows', formatted: 'Arrows' },
        { original: 'business__statistics', formatted: 'Business Statistics' }
      ]);

      // Verify the formatted data was written
      const writtenData = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
      expect(writtenData[0].category).toBe('Action Interface');
      expect(writtenData[1].category).toBe('Arrows');
      expect(writtenData[2].category).toBe('Business Statistics');
    });

    it('should handle file read errors', () => {
      fs.readFileSync.mockImplementation(() => {
        throw new Error('File not found');
      });

      const result = formatIconCategories('./nonexistent.json');

      expect(result.success).toBe(false);
      expect(result.error).toBe('File not found');
    });

    it('should handle invalid JSON data', () => {
      fs.readFileSync.mockReturnValue('invalid json');

      const result = formatIconCategories('./invalid.json');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unexpected token');
    });

    it('should handle non-array data', () => {
      fs.readFileSync.mockReturnValue(JSON.stringify({ not: 'array' }));

      const result = formatIconCategories('./invalid.json');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Icon data must be an array');
    });

    it('should use different output path when provided', () => {
      fs.readFileSync.mockReturnValue(JSON.stringify(mockIconData));
      fs.writeFileSync.mockImplementation(() => {});

      const result = formatIconCategories('./input.json', './output.json');

      expect(result.success).toBe(true);
      expect(result.filePath).toBe('./output.json');
      expect(fs.writeFileSync).toHaveBeenCalledWith('./output.json', expect.any(String));
    });
  });

  describe('previewCategoryFormatting', () => {
    const mockIconData = [
      { name: 'home', category: 'Action Interface', svg: '<svg>home</svg>' },
      { name: 'arrow', category: 'arrows', svg: '<svg>arrow</svg>' },
      { name: 'chart', category: 'Business Statistics', svg: '<svg>chart</svg>' }
    ];

    it('should preview category changes without modifying data', () => {
      fs.readFileSync.mockReturnValue(JSON.stringify(mockIconData));

      const result = previewCategoryFormatting('./test.json');

      expect(result.success).toBe(true);
      expect(result.totalCategories).toBe(3);
      expect(result.categoriesNeedingFormat).toBe(1); // only arrows needs formatting
      expect(result.preview).toEqual([
        { original: 'Action Interface', formatted: 'Action Interface', changed: false },
        { original: 'arrows', formatted: 'Arrows', changed: true },
        { original: 'Business Statistics', formatted: 'Business Statistics', changed: false }
      ]);

      // Verify no file was written
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });

    it('should handle preview errors', () => {
      fs.readFileSync.mockImplementation(() => {
        throw new Error('Access denied');
      });

      const result = previewCategoryFormatting('./denied.json');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Access denied');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty icon array', () => {
      fs.readFileSync.mockReturnValue(JSON.stringify([]));
      fs.writeFileSync.mockImplementation(() => {});

      const result = formatIconCategories('./empty.json');

      expect(result.success).toBe(true);
      expect(result.iconsUpdated).toBe(0);
      expect(result.categoriesFormatted).toBe(0);
      expect(result.categoryMapping).toEqual([]);
    });

    it('should handle icons without categories', () => {
      const iconsWithoutCategory = [
        { name: 'home', svg: '<svg>home</svg>' },
        { name: 'arrow', category: '', svg: '<svg>arrow</svg>' }
      ];

      fs.readFileSync.mockReturnValue(JSON.stringify(iconsWithoutCategory));
      fs.writeFileSync.mockImplementation(() => {});

      const result = formatIconCategories('./test.json');

      expect(result.success).toBe(true);
      expect(result.iconsUpdated).toBe(2);
    });
  });
});
