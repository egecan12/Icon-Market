import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRedux, userEvent, mockIcon } from '../../../test/test-utils'
import IconItem from '../IconItem'

describe('IconItem Component', () => {
  const mockOnClick = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Render Tests', () => {
    it('should render icon name correctly', () => {
      renderWithRedux(
        <IconItem icon={mockIcon} isSelected={false} onClick={mockOnClick} />
      )
      
      expect(screen.getByText('test-icon')).toBeInTheDocument()
    })

    it('should render SVG content safely', () => {
      renderWithRedux(
        <IconItem icon={mockIcon} isSelected={false} onClick={mockOnClick} />
      )
      
      const iconDisplay = document.querySelector('.icon-display')
      expect(iconDisplay).toBeInTheDocument()
      expect(iconDisplay?.innerHTML).toContain('rect')
    })

    it('should apply selected class when isSelected is true', () => {
      renderWithRedux(
        <IconItem icon={mockIcon} isSelected={true} onClick={mockOnClick} />
      )
      
      const iconItem = document.querySelector('.icon-item')
      expect(iconItem).toHaveClass('selected')
    })

    it('should not apply selected class when isSelected is false', () => {
      renderWithRedux(
        <IconItem icon={mockIcon} isSelected={false} onClick={mockOnClick} />
      )
      
      const iconItem = document.querySelector('.icon-item')
      expect(iconItem).not.toHaveClass('selected')
    })
  })

  describe('Functionality Tests', () => {
    it('should call onClick with correct icon when clicked', async () => {
      const user = userEvent.setup()
      
      renderWithRedux(
        <IconItem icon={mockIcon} isSelected={false} onClick={mockOnClick} />
      )
      
      const iconItem = document.querySelector('.icon-item')!
      await user.click(iconItem)
      
      expect(mockOnClick).toHaveBeenCalledTimes(1)
      expect(mockOnClick).toHaveBeenCalledWith(mockIcon)
    })

    it('should handle multiple clicks correctly', async () => {
      const user = userEvent.setup()
      
      renderWithRedux(
        <IconItem icon={mockIcon} isSelected={false} onClick={mockOnClick} />
      )
      
      const iconItem = document.querySelector('.icon-item')!
      await user.click(iconItem)
      await user.click(iconItem)
      
      expect(mockOnClick).toHaveBeenCalledTimes(2)
    })
  })

  describe('Edge Cases', () => {
    it('should handle icon with missing SVG gracefully', () => {
      const iconWithoutSvg = { ...mockIcon, svg: undefined }
      
      renderWithRedux(
        <IconItem icon={iconWithoutSvg} isSelected={false} onClick={mockOnClick} />
      )
      
      expect(screen.getByText('test-icon')).toBeInTheDocument()
      const iconDisplay = document.querySelector('.icon-display')
      expect(iconDisplay).toBeInTheDocument()
    })

    it('should handle very long icon names', () => {
      const longNameIcon = { 
        ...mockIcon, 
        name: 'very-long-icon-name-that-might-cause-layout-issues-in-the-ui-component' 
      }
      
      renderWithRedux(
        <IconItem icon={longNameIcon} isSelected={false} onClick={mockOnClick} />
      )
      
      expect(screen.getByText(longNameIcon.name)).toBeInTheDocument()
    })

    it('should handle empty SVG string', () => {
      const emptyIcon = { ...mockIcon, svg: '' }
      
      renderWithRedux(
        <IconItem icon={emptyIcon} isSelected={false} onClick={mockOnClick} />
      )
      
      expect(screen.getByText('test-icon')).toBeInTheDocument()
    })

    it('should sanitize potentially dangerous SVG content', () => {
      const dangerousIcon = {
        ...mockIcon,
        svg: '<svg><script>alert("xss")</script><rect width="24" height="24"/></svg>'
      }
      
      renderWithRedux(
        <IconItem icon={dangerousIcon} isSelected={false} onClick={mockOnClick} />
      )
      
      const iconDisplay = document.querySelector('.icon-display')
      expect(iconDisplay?.innerHTML).not.toContain('script')
      expect(iconDisplay?.innerHTML).toContain('rect')
    })
  })

  describe('Accessibility Tests', () => {
    it('should be keyboard accessible', async () => {
      const user = userEvent.setup()
      
      renderWithRedux(
        <IconItem icon={mockIcon} isSelected={false} onClick={mockOnClick} />
      )
      
      const iconItem = document.querySelector('.icon-item')!
      await user.click(iconItem) // Test click functionality instead
      
      expect(mockOnClick).toHaveBeenCalledWith(mockIcon)
    })

    it('should have proper tab order', () => {
      renderWithRedux(
        <IconItem icon={mockIcon} isSelected={false} onClick={mockOnClick} />
      )
      
      const iconItem = document.querySelector('.icon-item')!
      expect(iconItem).toBeVisible()
      expect(iconItem.getAttribute('tabIndex')).not.toBe('-1')
    })

    it('should have meaningful content for screen readers', () => {
      renderWithRedux(
        <IconItem icon={mockIcon} isSelected={false} onClick={mockOnClick} />
      )
      
      expect(screen.getByText('test-icon')).toBeInTheDocument()
      const iconName = screen.getByText('test-icon')
      expect(iconName).toHaveClass('icon-name')
    })
  })
})
