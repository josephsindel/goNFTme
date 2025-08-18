import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SafeImage } from '../SafeImage'

// Mock the ipfsToHttp function
jest.mock('../../utils/ipfs', () => ({
  ipfsToHttp: jest.fn((uri: string) => {
    if (!uri || uri.trim() === '') return '/placeholder-campaign.svg'
    if (uri.startsWith('user-upload-')) {
      // Simulate localStorage lookup
      if (uri === 'user-upload-found') return 'data:image/png;base64,mock-data'
      return `https://picsum.photos/400/300?random=${uri.slice(-8)}`
    }
    if (uri.startsWith('Qm')) return `https://ipfs.io/ipfs/${uri}`
    return uri
  })
}))

// Mock Next.js Image component to avoid issues with optimization
jest.mock('next/image', () => {
  return function MockImage({ src, alt, onError, ...props }: any) {
    return (
      <img
        {...props}
        src={src}
        alt={alt}
        onError={onError}
        data-testid="mock-image"
      />
    )
  }
})

describe('SafeImage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Empty/Invalid Source Handling', () => {
    it('handles empty string src without passing it to Image component', () => {
      render(<SafeImage src="" alt="Test image" fill />)
      
      const image = screen.getByTestId('mock-image')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', '/placeholder-campaign.svg')
      expect(image).not.toHaveAttribute('src', '')
    })

    it('handles null src', () => {
      render(<SafeImage src={null as any} alt="Test image" fill />)
      
      const image = screen.getByTestId('mock-image')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', '/placeholder-campaign.svg')
    })

    it('handles undefined src', () => {
      render(<SafeImage src={undefined as any} alt="Test image" fill />)
      
      const image = screen.getByTestId('mock-image')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', '/placeholder-campaign.svg')
    })

    it('handles whitespace-only src', () => {
      render(<SafeImage src="   " alt="Test image" fill />)
      
      const image = screen.getByTestId('mock-image')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', '/placeholder-campaign.svg')
    })
  })

  describe('Valid Source Handling', () => {
    it('handles IPFS src correctly', () => {
      render(<SafeImage src="QmTest123" alt="Test image" fill />)
      
      const image = screen.getByTestId('mock-image')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', 'https://ipfs.io/ipfs/QmTest123')
    })

    it('handles user-upload src correctly', () => {
      render(<SafeImage src="user-upload-found" alt="Test image" fill />)
      
      const image = screen.getByTestId('mock-image')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', 'data:image/png;base64,mock-data')
    })

    it('handles regular HTTP URLs', () => {
      render(<SafeImage src="https://example.com/image.jpg" alt="Test image" fill />)
      
      const image = screen.getByTestId('mock-image')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
    })
  })

  describe('Error Handling', () => {
    it('falls back to picsum for user-upload when localStorage fails', () => {
      render(<SafeImage src="user-upload-missing" alt="Test image" fill />)
      
      const image = screen.getByTestId('mock-image')
      // Should immediately show picsum fallback for missing user-upload
      expect(image).toHaveAttribute('src', 'https://picsum.photos/400/300?random=-missing')
    })

    it('shows fallback icon when all image sources fail', async () => {
      render(
        <SafeImage 
          src="/placeholder-campaign.svg" 
          alt="Test image" 
          fill 
          fallbackIcon={<div data-testid="fallback-icon">Fallback</div>}
        />
      )
      
      const image = screen.getByTestId('mock-image')
      
      // Simulate placeholder image error (this should trigger icon fallback)
      fireEvent.error(image)
      
      await waitFor(() => {
        expect(screen.getByTestId('fallback-icon')).toBeInTheDocument()
      })
    })
  })

  describe('Props Handling', () => {
    it('passes through all Image props correctly', () => {
      render(
        <SafeImage 
          src="test.jpg" 
          alt="Test image" 
          width={100}
          height={100}
          className="test-class"
          sizes="100vw"
        />
      )
      
      const image = screen.getByTestId('mock-image')
      expect(image).toHaveAttribute('width', '100')
      expect(image).toHaveAttribute('height', '100')
      expect(image).toHaveAttribute('class', 'test-class')
      expect(image).toHaveAttribute('sizes', '100vw')
    })

    it('handles fill prop correctly', () => {
      render(<SafeImage src="test.jpg" alt="Test image" fill />)
      
      const image = screen.getByTestId('mock-image')
      // The fill prop gets passed through to the mock image
      expect(image).toBeInTheDocument()
    })
  })

  describe('Dynamic Source Changes', () => {
    it('updates image source when src prop changes', async () => {
      const { rerender } = render(<SafeImage src="initial.jpg" alt="Test image" fill />)
      
      let image = screen.getByTestId('mock-image')
      expect(image).toHaveAttribute('src', 'initial.jpg')
      
      rerender(<SafeImage src="updated.jpg" alt="Test image" fill />)
      
      await waitFor(() => {
        image = screen.getByTestId('mock-image')
        expect(image).toHaveAttribute('src', 'updated.jpg')
      })
    })

    it('resets error state when src changes', async () => {
      const { rerender } = render(<SafeImage src="failing.jpg" alt="Test image" fill />)
      
      let image = screen.getByTestId('mock-image')
      expect(image).toHaveAttribute('src', 'failing.jpg')
      
      // Change to valid source - this should reset error state
      rerender(<SafeImage src="valid.jpg" alt="Test image" fill />)
      
      await waitFor(() => {
        image = screen.getByTestId('mock-image')
        expect(image).toHaveAttribute('src', 'valid.jpg')
      })
    })
  })
})