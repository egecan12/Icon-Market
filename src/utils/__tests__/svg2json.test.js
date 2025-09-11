import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import { convertSvgToJson, saveIconsToJson, processSvgToJson } from '../svg2json.js';

// Mock fs module
vi.mock('fs');

describe('SVG to JSON Converter', () => {
  const mockRootPath = '/mock/icons';
  const mockOutputPath = '/mock/output/icons.json';

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('convertSvgToJson', () => {
    it('should convert SVG files to JSON format correctly', () => {
      // Mock file system structure
      const mockSvgContent = '<svg xmlns="http://www.w3.org/2000/svg"><path d="M10 10"/></svg>';
      
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync
        .mockReturnValueOnce(['category1', 'category2']) // Root directory
        .mockReturnValueOnce(['icon1.svg', 'icon2.svg']) // category1
        .mockReturnValueOnce(['icon3.svg', 'not-svg.txt']); // category2
      
      fs.statSync.mockReturnValue({ isDirectory: () => true });
      fs.readFileSync.mockReturnValue(mockSvgContent);

      const result = convertSvgToJson(mockRootPath);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        name: 'icon1',
        category: 'category1',
        svg: mockSvgContent
      });
      expect(result[1]).toEqual({
        name: 'icon2',
        category: 'category1',
        svg: mockSvgContent
      });
      expect(result[2]).toEqual({
        name: 'icon3',
        category: 'category2',
        svg: mockSvgContent
      });
    });

    it('should throw error if root path does not exist', () => {
      fs.existsSync.mockReturnValue(false);

      expect(() => convertSvgToJson('/non-existent')).toThrow('Root path does not exist');
    });


    it('should handle SVG files with whitespace', () => {
      const svgWithWhitespace = '  <svg>content</svg>  \n  ';
      
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync
        .mockReturnValueOnce(['category1'])
        .mockReturnValueOnce(['icon1.svg']);
      fs.statSync.mockReturnValue({ isDirectory: () => true });
      fs.readFileSync.mockReturnValue(svgWithWhitespace);

      const result = convertSvgToJson(mockRootPath);

      expect(result[0].svg).toBe('<svg>content</svg>');
    });

    it('should handle read errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync
        .mockReturnValueOnce(['category1'])
        .mockReturnValueOnce(['good.svg', 'bad.svg']);
      fs.statSync.mockReturnValue({ isDirectory: () => true });
      fs.readFileSync
        .mockReturnValueOnce('<svg>good</svg>')
        .mockImplementationOnce(() => { throw new Error('Permission denied'); });

      const result = convertSvgToJson(mockRootPath);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('good');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to read SVG file: bad.svg',
        'Permission denied'
      );
    });
  });

  describe('saveIconsToJson', () => {
    it('should save icon data to JSON file', () => {
      const mockData = [
        { name: 'icon1', category: 'cat1', svg: '<svg/>' }
      ];

      fs.existsSync.mockReturnValue(true);
      fs.writeFileSync.mockImplementation(() => {});

      saveIconsToJson(mockData, mockOutputPath);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        mockOutputPath,
        JSON.stringify(mockData, null, 2)
      );
    });

    it('should create output directory if it does not exist', () => {
      const mockData = [{ name: 'icon1', category: 'cat1', svg: '<svg/>' }];
      
      fs.existsSync.mockReturnValue(false);
      fs.mkdirSync.mockImplementation(() => {});
      fs.writeFileSync.mockImplementation(() => {});

      saveIconsToJson(mockData, '/new/path/icons.json');

      expect(fs.mkdirSync).toHaveBeenCalledWith('/new/path', { recursive: true });
    });

    it('should throw error if data is not an array', () => {
      expect(() => saveIconsToJson('not-array', mockOutputPath)).toThrow('Icon data must be an array');
      expect(() => saveIconsToJson(null, mockOutputPath)).toThrow('Icon data must be an array');
      expect(() => saveIconsToJson({}, mockOutputPath)).toThrow('Icon data must be an array');
    });
  });

  describe('processSvgToJson', () => {
    it('should process SVG directory and save to JSON successfully', () => {
      const mockData = [{ name: 'icon1', category: 'cat1', svg: '<svg/>' }];
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      // Mock successful conversion
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync
        .mockReturnValueOnce(['cat1'])
        .mockReturnValueOnce(['icon1.svg']);
      fs.statSync.mockReturnValue({ isDirectory: () => true });
      fs.readFileSync.mockReturnValue('<svg/>');
      fs.writeFileSync.mockImplementation(() => {});

      const result = processSvgToJson(mockRootPath, mockOutputPath);

      expect(result).toEqual(mockData);
      expect(consoleSpy).toHaveBeenCalledWith(
        `Successfully processed 1 icons to ${mockOutputPath}`
      );
    });

    it('should handle and re-throw errors', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      fs.existsSync.mockReturnValue(false);

      expect(() => processSvgToJson('/bad/path')).toThrow();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error processing SVG to JSON:',
        'Root path does not exist: /bad/path'
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty directories', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValueOnce([]); // Empty root directory

      const result = convertSvgToJson(mockRootPath);

      expect(result).toHaveLength(0);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle categories with no SVG files', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync
        .mockReturnValueOnce(['category1'])
        .mockReturnValueOnce(['readme.txt', 'image.png']); // No SVG files
      fs.statSync.mockReturnValue({ isDirectory: () => true });

      const result = convertSvgToJson(mockRootPath);

      expect(result).toHaveLength(0);
    });

    it('should handle complex file names correctly', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync
        .mockReturnValueOnce(['category1'])
        .mockReturnValueOnce(['icon-with-dashes.svg', 'icon_with_underscores.svg', 'icon.complex.name.svg']);
      fs.statSync.mockReturnValue({ isDirectory: () => true });
      fs.readFileSync.mockReturnValue('<svg></svg>');

      const result = convertSvgToJson(mockRootPath);

      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('icon-with-dashes');
      expect(result[1].name).toBe('icon_with_underscores');
      expect(result[2].name).toBe('icon.complex.name');
    });
  });
});
