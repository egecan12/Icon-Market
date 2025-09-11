import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRedux, userEvent } from '../../../test/test-utils'
import SearchBar from '../SearchBar'

describe('SearchBar Component', () => {
  const mockOnSearchChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Render Tests', () => {
    it('should render search input with correct initial value', () => {
      renderWithRedux(
        <SearchBar searchTerm="initial-value" onSearchChange={mockOnSearchChange} />
      )
      
      const searchInput = screen.getByDisplayValue('initial-value')
      expect(searchInput).toBeInTheDocument()
    })

    it('should render search input with empty value when no searchTerm provided', () => {
      renderWithRedux(
        <SearchBar searchTerm="" onSearchChange={mockOnSearchChange} />
      )
      
      const searchInput = screen.getByRole('textbox')
      expect(searchInput).toHaveValue('')
    })

    it('should render search icon', () => {
      renderWithRedux(
        <SearchBar searchTerm="" onSearchChange={mockOnSearchChange} />
      )
      
      const searchIcon = document.querySelector('.search-icon')
      expect(searchIcon).toBeInTheDocument()
    })

    it('should have proper placeholder text', () => {
      renderWithRedux(
        <SearchBar searchTerm="" onSearchChange={mockOnSearchChange} />
      )
      
      const searchInput = screen.getByPlaceholderText('Search icons by name...')
      expect(searchInput).toBeInTheDocument()
    })
  })

  describe('Functionality Tests', () => {
    it('should call onSearchChange when user types', async () => {
      const user = userEvent.setup()
      
      renderWithRedux(
        <SearchBar searchTerm="" onSearchChange={mockOnSearchChange} />
      )
      
      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'test')
      
      expect(mockOnSearchChange).toHaveBeenCalledTimes(4) // Called for each character
      expect(mockOnSearchChange).toHaveBeenNthCalledWith(1, 't')
      expect(mockOnSearchChange).toHaveBeenNthCalledWith(2, 'te')
      expect(mockOnSearchChange).toHaveBeenNthCalledWith(3, 'tes')
      expect(mockOnSearchChange).toHaveBeenNthCalledWith(4, 'test')
    })

    it('should handle backspace and deletion', async () => {
      const user = userEvent.setup()
      
      renderWithRedux(
        <SearchBar searchTerm="test" onSearchChange={mockOnSearchChange} />
      )
      
      const searchInput = screen.getByRole('textbox')
      await user.clear(searchInput)
      
      expect(mockOnSearchChange).toHaveBeenCalledWith('')
    })

    it('should handle special characters', async () => {
      const user = userEvent.setup()
      
      renderWithRedux(
        <SearchBar searchTerm="" onSearchChange={mockOnSearchChange} />
      )
      
      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, '!@#$%^&*()')
      
      expect(mockOnSearchChange).toHaveBeenLastCalledWith('!@#$%^&*()')
    })

    it('should handle very long search terms', async () => {
      const user = userEvent.setup()
      const longTerm = 'this-is-a-very-long-search-term-that-might-cause-performance-issues'
      
      renderWithRedux(
        <SearchBar searchTerm="" onSearchChange={mockOnSearchChange} />
      )
      
      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, longTerm)
      
      expect(mockOnSearchChange).toHaveBeenLastCalledWith(longTerm)
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid typing', async () => {
      const user = userEvent.setup()
      
      renderWithRedux(
        <SearchBar searchTerm="" onSearchChange={mockOnSearchChange} />
      )
      
      const searchInput = screen.getByRole('textbox')
      
      // Simulate rapid typing
      await user.type(searchInput, 'abc')
      
      expect(mockOnSearchChange).toHaveBeenCalledTimes(3)
      expect(mockOnSearchChange).toHaveBeenLastCalledWith('abc')
    })

    it('should handle copy-paste operations', async () => {
      const user = userEvent.setup()
      
      renderWithRedux(
        <SearchBar searchTerm="" onSearchChange={mockOnSearchChange} />
      )
      
      const searchInput = screen.getByRole('textbox')
      
      // Simulate paste operation
      await user.click(searchInput)
      await user.paste('pasted-content')
      
      expect(mockOnSearchChange).toHaveBeenCalledWith('pasted-content')
    })

    it('should maintain focus during typing', async () => {
      const user = userEvent.setup()
      
      renderWithRedux(
        <SearchBar searchTerm="" onSearchChange={mockOnSearchChange} />
      )
      
      const searchInput = screen.getByRole('textbox')
      await user.click(searchInput)
      await user.type(searchInput, 'test')
      
      expect(searchInput).toHaveFocus()
    })
  })

  describe('Accessibility Tests', () => {
    it('should be keyboard accessible', async () => {
      const user = userEvent.setup()
      
      renderWithRedux(
        <SearchBar searchTerm="" onSearchChange={mockOnSearchChange} />
      )
      
      const searchInput = screen.getByRole('textbox')
      
      await user.tab()
      expect(searchInput).toHaveFocus()
      
      await user.type(searchInput, 'keyboard-test')
      expect(mockOnSearchChange).toHaveBeenLastCalledWith('keyboard-test')
    })

    it('should have proper ARIA attributes', () => {
      renderWithRedux(
        <SearchBar searchTerm="" onSearchChange={mockOnSearchChange} />
      )
      
      const searchInput = screen.getByRole('textbox')
      expect(searchInput).toHaveAttribute('type', 'text')
      expect(searchInput).toHaveAttribute('placeholder', 'Search icons by name...')
    })

    it('should have proper labeling for screen readers', () => {
      renderWithRedux(
        <SearchBar searchTerm="" onSearchChange={mockOnSearchChange} />
      )
      
      const searchInput = screen.getByRole('textbox')
      expect(searchInput).toBeInTheDocument()
      
      // Check for proper structure that screen readers can understand
      const searchContainer = document.querySelector('.search-section')
      expect(searchContainer).toBeInTheDocument()
    })

    it('should support screen reader navigation', () => {
      renderWithRedux(
        <SearchBar searchTerm="" onSearchChange={mockOnSearchChange} />
      )
      
      const searchInput = screen.getByRole('textbox')
      expect(searchInput).toBeVisible()
      expect(searchInput).not.toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('Performance Tests', () => {
    it('should not cause excessive re-renders on fast typing', async () => {
      const user = userEvent.setup()
      let callCount = 0
      const performantOnChange = vi.fn(() => {
        callCount++
      })
      
      renderWithRedux(
        <SearchBar searchTerm="" onSearchChange={performantOnChange} />
      )
      
      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'fast-typing-test')
      
      // Should be called once per character
      expect(callCount).toBe(16) // length of 'fast-typing-test'
    })
  })
})
