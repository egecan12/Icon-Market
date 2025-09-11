import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRedux, userEvent, mockIcons, mockIcon } from '../../../test/test-utils'
import IconList from '../IconList'

describe('IconList Component', () => {
  const mockOnIconClick = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Render Tests', () => {
    it('should render all icons when provided with valid data', () => {
      renderWithRedux(
        <IconList 
          icons={mockIcons} 
          selectedIcon={null} 
          onIconClick={mockOnIconClick} 
        />
      )
      
      expect(screen.getByText('test-icon')).toBeInTheDocument()
      expect(screen.getByText('second-icon')).toBeInTheDocument()
      expect(screen.getByText('third-icon')).toBeInTheDocument()
    })

    it('should render icons in a grid layout', () => {
      renderWithRedux(
        <IconList 
          icons={mockIcons} 
          selectedIcon={null} 
          onIconClick={mockOnIconClick} 
        />
      )
      
      const iconGrid = document.querySelector('.icon-grid')
      expect(iconGrid).toBeInTheDocument()
    })

    it('should highlight selected icon correctly', () => {
      renderWithRedux(
        <IconList 
          icons={mockIcons} 
          selectedIcon={mockIcon} 
          onIconClick={mockOnIconClick} 
        />
      )
      
      const selectedIconElement = document.querySelector('.icon-item.selected')
      expect(selectedIconElement).toBeInTheDocument()
    })
  })

  describe('Mock Data Tests', () => {
    it('should handle empty icon array gracefully', () => {
      renderWithRedux(
        <IconList 
          icons={[]} 
          selectedIcon={null} 
          onIconClick={mockOnIconClick} 
        />
      )
      
      expect(screen.getByText('No icons found')).toBeInTheDocument()
      expect(screen.getByText('Try adjusting your search or filter criteria')).toBeInTheDocument()
    })

    it('should map mock data correctly', () => {
      renderWithRedux(
        <IconList 
          icons={mockIcons} 
          selectedIcon={null} 
          onIconClick={mockOnIconClick} 
        />
      )
      
      // Verify all mock icons are rendered
      mockIcons.forEach(icon => {
        expect(screen.getByText(icon.name)).toBeInTheDocument()
      })
    })

    it('should handle single icon array', () => {
      renderWithRedux(
        <IconList 
          icons={[mockIcon]} 
          selectedIcon={null} 
          onIconClick={mockOnIconClick} 
        />
      )
      
      expect(screen.getByText('test-icon')).toBeInTheDocument()
      expect(screen.queryByText('second-icon')).not.toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle null icons data', () => {
      renderWithRedux(
        <IconList 
          icons={null as any} 
          selectedIcon={null} 
          onIconClick={mockOnIconClick} 
        />
      )
      
      expect(screen.getByText('Data Error')).toBeInTheDocument()
      expect(screen.getByText('No icon data available')).toBeInTheDocument()
    })

    it('should handle undefined icons data', () => {
      renderWithRedux(
        <IconList 
          icons={undefined as any} 
          selectedIcon={null} 
          onIconClick={mockOnIconClick} 
        />
      )
      
      expect(screen.getByText('Data Error')).toBeInTheDocument()
    })

    it('should handle non-array icons data', () => {
      renderWithRedux(
        <IconList 
          icons={'not-an-array' as any} 
          selectedIcon={null} 
          onIconClick={mockOnIconClick} 
        />
      )
      
      expect(screen.getByText('Data Error')).toBeInTheDocument()
      expect(screen.getByText('Invalid icon data format')).toBeInTheDocument()
    })

    it('should handle icons with missing properties', () => {
      const invalidIcons = [
        { name: 'valid-icon', category: 'test' },
        { name: '', category: 'test' }, // missing name
        { category: 'test' }, // missing name property
        { name: 'test' }, // missing category
      ]

      renderWithRedux(
        <IconList 
          icons={invalidIcons as any} 
          selectedIcon={null} 
          onIconClick={mockOnIconClick} 
        />
      )
      
      expect(screen.getByText('Data Error')).toBeInTheDocument()
      expect(screen.getByText('Missing required icon properties')).toBeInTheDocument()
    })

    it('should handle very large icon arrays', () => {
      const largeIconArray = Array.from({ length: 1000 }, (_, i) => ({
        name: `icon-${i}`,
        category: `category-${i % 10}`,
        svg: `<svg><rect width="${i}" height="${i}"/></svg>`
      }))

      renderWithRedux(
        <IconList 
          icons={largeIconArray} 
          selectedIcon={null} 
          onIconClick={mockOnIconClick} 
        />
      )
      
      expect(screen.getByText('icon-0')).toBeInTheDocument()
      expect(screen.getByText('icon-999')).toBeInTheDocument()
    })
  })

  describe('Functionality Tests', () => {
    it('should call onIconClick when an icon is clicked', async () => {
      const user = userEvent.setup()
      
      renderWithRedux(
        <IconList 
          icons={mockIcons} 
          selectedIcon={null} 
          onIconClick={mockOnIconClick} 
        />
      )
      
      const firstIcon = screen.getByText('test-icon')
      await user.click(firstIcon.closest('.icon-item')!)
      
      expect(mockOnIconClick).toHaveBeenCalledWith(mockIcon)
    })

    it('should handle multiple icon clicks independently', async () => {
      const user = userEvent.setup()
      
      renderWithRedux(
        <IconList 
          icons={mockIcons} 
          selectedIcon={null} 
          onIconClick={mockOnIconClick} 
        />
      )
      
      const firstIcon = screen.getByText('test-icon')
      const secondIcon = screen.getByText('second-icon')
      
      await user.click(firstIcon.closest('.icon-item')!)
      await user.click(secondIcon.closest('.icon-item')!)
      
      expect(mockOnIconClick).toHaveBeenCalledTimes(2)
      expect(mockOnIconClick).toHaveBeenNthCalledWith(1, mockIcons[0])
      expect(mockOnIconClick).toHaveBeenNthCalledWith(2, mockIcons[1])
    })

    it('should work correctly with rapid successive clicks', async () => {
      const user = userEvent.setup()
      
      renderWithRedux(
        <IconList 
          icons={mockIcons} 
          selectedIcon={null} 
          onIconClick={mockOnIconClick} 
        />
      )
      
      const firstIcon = screen.getByText('test-icon').closest('.icon-item')!
      
      await user.click(firstIcon)
      await user.click(firstIcon)
      await user.click(firstIcon)
      
      expect(mockOnIconClick).toHaveBeenCalledTimes(3)
    })
  })

  describe('Error Handling', () => {
    it('should display error message for invalid data', () => {
      renderWithRedux(
        <IconList 
          icons={null as any} 
          selectedIcon={null} 
          onIconClick={mockOnIconClick} 
        />
      )
      
      expect(screen.getByText('Data Error')).toBeInTheDocument()
      expect(screen.getByText('Please try refreshing the page or contact support if the issue persists.')).toBeInTheDocument()
    })

    it('should show appropriate error for different error types', () => {
      renderWithRedux(
        <IconList 
          icons={'invalid' as any} 
          selectedIcon={null} 
          onIconClick={mockOnIconClick} 
        />
      )
      
      expect(screen.getByText('Invalid icon data format')).toBeInTheDocument()
    })
  })
})
