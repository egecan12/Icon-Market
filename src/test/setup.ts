import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
    readText: vi.fn(() => Promise.resolve('')),
  },
})

// Mock window.URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url')
global.URL.revokeObjectURL = vi.fn()

// Mock document.createElement
const mockAnchor = {
  href: '',
  download: '',
  click: vi.fn(),
  setAttribute: vi.fn(),
  getAttribute: vi.fn(),
  style: {},
}

// Fix createElement mock to return proper DOM elements
const originalCreateElement = document.createElement.bind(document)
global.document.createElement = vi.fn((tagName: string) => {
  if (tagName === 'a') {
    return mockAnchor as any
  }
  return originalCreateElement(tagName)
})
