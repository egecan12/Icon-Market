import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithRedux, userEvent, mockIcon } from '../../../test/test-utils'
import IconDetail from '../IconDetail'

// Mock navigator.clipboard
const mockWriteText = vi.fn()
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
})

describe('IconDetail Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockWriteText.mockResolvedValue(undefined)
  })

  describe('Render Tests', () => {
    it('should render icon details when icon is provided', () => {
      renderWithRedux(<IconDetail icon={mockIcon} />)
      
      expect(screen.getByText('test-icon')).toBeInTheDocument()
      expect(screen.getByText('test-category')).toBeInTheDocument()
    })

    it('should render all action buttons', () => {
      renderWithRedux(<IconDetail icon={mockIcon} />)
      
      expect(screen.getByText('Copy Name')).toBeInTheDocument()
      expect(screen.getByText('Copy SVG')).toBeInTheDocument()
      expect(screen.getByText('Download')).toBeInTheDocument()
    })

    it('should render icon preview correctly', () => {
      renderWithRedux(<IconDetail icon={mockIcon} />)
      
      const previewContainer = document.querySelector('.icon-preview-bg')
      expect(previewContainer).toBeInTheDocument()
    })

    it('should show placeholder when no icon selected', () => {
      renderWithRedux(<IconDetail icon={null} />)
      
      expect(screen.getByText('Select an Icon')).toBeInTheDocument()
    })
  })

  describe('Copy Name Functionality', () => {
    it('should copy icon name to clipboard when Copy Name button is clicked', async () => {
      const user = userEvent.setup()
      
      renderWithRedux(<IconDetail icon={mockIcon} />)
      
      const copyNameButton = screen.getByText('Copy Name')
      await user.click(copyNameButton)
      
      expect(mockWriteText).toHaveBeenCalledWith('test-icon')
    })

    it('should show success feedback after copying name', async () => {
      const user = userEvent.setup()
      
      renderWithRedux(<IconDetail icon={mockIcon} />)
      
      const copyNameButton = screen.getByText('Copy Name')
      await user.click(copyNameButton)
      
      await waitFor(() => {
        expect(screen.getByText('Copied!')).toBeInTheDocument()
      })
    })

    it('should reset feedback after timeout', async () => {
      const user = userEvent.setup()
      vi.useFakeTimers()
      
      renderWithRedux(<IconDetail icon={mockIcon} />)
      
      const copyNameButton = screen.getByText('Copy Name')
      await user.click(copyNameButton)
      
      expect(screen.getByText('Copied!')).toBeInTheDocument()
      
      vi.advanceTimersByTime(2000)
      
      await waitFor(() => {
        expect(screen.queryByText('Copied!')).not.toBeInTheDocument()
      })
      
      vi.useRealTimers()
    })
  })

  describe('Copy SVG Functionality', () => {
    it('should copy SVG content to clipboard when Copy SVG button is clicked', async () => {
      const user = userEvent.setup()
      
      renderWithRedux(<IconDetail icon={mockIcon} />)
      
      const copySvgButton = screen.getByText('Copy SVG')
      await user.click(copySvgButton)
      
      expect(mockWriteText).toHaveBeenCalledWith('<svg><rect width="24" height="24"/></svg>')
    })

    it('should show SVG copied feedback', async () => {
      const user = userEvent.setup()
      
      renderWithRedux(<IconDetail icon={mockIcon} />)
      
      const copySvgButton = screen.getByText('Copy SVG')
      await user.click(copySvgButton)
      
      await waitFor(() => {
        expect(screen.getByText('SVG Copied!')).toBeInTheDocument()
      })
    })

    it('should handle SVG copy failure gracefully', async () => {
      const user = userEvent.setup()
      mockWriteText.mockRejectedValueOnce(new Error('Clipboard error'))
      
      // Mock window.alert
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
      
      renderWithRedux(<IconDetail icon={mockIcon} />)
      
      const copySvgButton = screen.getByText('Copy SVG')
      await user.click(copySvgButton)
      
      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Failed to copy SVG code')
      })
      
      alertSpy.mockRestore()
    })
  })

  describe('Download Functionality', () => {
    it('should trigger download when Download button is clicked', async () => {
      const user = userEvent.setup()
      const mockAnchor = {
        href: '',
        download: '',
        click: vi.fn(),
      }
      
      // Mock document.createElement to return our mock anchor
      const createElementSpy = vi.spyOn(document, 'createElement')
      createElementSpy.mockReturnValue(mockAnchor as any)
      
      renderWithRedux(<IconDetail icon={mockIcon} />)
      
      const downloadButton = screen.getByText('Download')
      await user.click(downloadButton)
      
      expect(mockAnchor.download).toBe('test-icon.svg')
      expect(mockAnchor.click).toHaveBeenCalled()
      
      createElementSpy.mockRestore()
    })

    it('should show download feedback', async () => {
      const user = userEvent.setup()
      
      renderWithRedux(<IconDetail icon={mockIcon} />)
      
      const downloadButton = screen.getByText('Download')
      await user.click(downloadButton)
      
      await waitFor(() => {
        expect(screen.getByText('Downloaded!')).toBeInTheDocument()
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle icon with missing SVG for clipboard operations', async () => {
      const user = userEvent.setup()
      const iconWithoutSvg = { ...mockIcon, svg: undefined }
      
      renderWithRedux(<IconDetail icon={iconWithoutSvg} />)
      
      const copySvgButton = screen.getByText('Copy SVG')
      await user.click(copySvgButton)
      
      expect(mockWriteText).toHaveBeenCalledWith('')
    })

    it('should handle rapid successive button clicks', async () => {
      const user = userEvent.setup()
      
      renderWithRedux(<IconDetail icon={mockIcon} />)
      
      const copyNameButton = screen.getByText('Copy Name')
      
      await user.click(copyNameButton)
      await user.click(copyNameButton)
      await user.click(copyNameButton)
      
      expect(mockWriteText).toHaveBeenCalledTimes(3)
    })

    it('should handle very long icon names', async () => {
      const user = userEvent.setup()
      const longNameIcon = {
        ...mockIcon,
        name: 'very-long-icon-name-that-might-cause-issues-with-clipboard-or-download-functionality'
      }
      
      renderWithRedux(<IconDetail icon={longNameIcon} />)
      
      const copyNameButton = screen.getByText('Copy Name')
      await user.click(copyNameButton)
      
      expect(mockWriteText).toHaveBeenCalledWith(longNameIcon.name)
    })

    it('should handle icons with special characters in name', async () => {
      const user = userEvent.setup()
      const specialNameIcon = {
        ...mockIcon,
        name: 'icon-with-special-chars!@#$%^&*()'
      }
      
      renderWithRedux(<IconDetail icon={specialNameIcon} />)
      
      const copyNameButton = screen.getByText('Copy Name')
      await user.click(copyNameButton)
      
      expect(mockWriteText).toHaveBeenCalledWith(specialNameIcon.name)
    })
  })

  describe('Accessibility Tests', () => {
    it('should have keyboard accessible buttons', async () => {
      const user = userEvent.setup()
      
      renderWithRedux(<IconDetail icon={mockIcon} />)
      
      const copyNameButton = screen.getByText('Copy Name')
      copyNameButton.focus()
      
      await user.keyboard('{Enter}')
      expect(mockWriteText).toHaveBeenCalledWith('test-icon')
    })

    it('should have proper button roles and labels', () => {
      renderWithRedux(<IconDetail icon={mockIcon} />)
      
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(3)
      
      expect(screen.getByText('Copy Name')).toBeInTheDocument()
      expect(screen.getByText('Copy SVG')).toBeInTheDocument()
      expect(screen.getByText('Download')).toBeInTheDocument()
    })

    it('should provide meaningful feedback for screen readers', async () => {
      const user = userEvent.setup()
      
      renderWithRedux(<IconDetail icon={mockIcon} />)
      
      const copyNameButton = screen.getByText('Copy Name')
      await user.click(copyNameButton)
      
      await waitFor(() => {
        const feedback = screen.getByText('Copied!')
        expect(feedback).toBeInTheDocument()
        expect(feedback).toBeVisible()
      })
    })

    it('should have proper tab order', () => {
      renderWithRedux(<IconDetail icon={mockIcon} />)
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toBeVisible()
        expect(button.getAttribute('tabIndex')).not.toBe('-1')
      })
    })
  })

  describe('Clipboard API Error Handling', () => {
    it('should handle clipboard write failures for name copying', async () => {
      const user = userEvent.setup()
      mockWriteText.mockRejectedValueOnce(new Error('Clipboard denied'))
      
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
      
      renderWithRedux(<IconDetail icon={mockIcon} />)
      
      const copyNameButton = screen.getByText('Copy Name')
      await user.click(copyNameButton)
      
      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Failed to copy icon name')
      })
      
      alertSpy.mockRestore()
    })

    it('should show error feedback when clipboard is unavailable', async () => {
      const user = userEvent.setup()
      
      // Temporarily remove clipboard API
      const originalClipboard = navigator.clipboard
      delete (navigator as any).clipboard
      
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
      
      renderWithRedux(<IconDetail icon={mockIcon} />)
      
      const copyNameButton = screen.getByText('Copy Name')
      await user.click(copyNameButton)
      
      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Failed to copy icon name')
      })
      
      // Restore clipboard API
      ;(navigator as any).clipboard = originalClipboard
      alertSpy.mockRestore()
    })
  })
})
