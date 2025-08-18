import { uploadImageToIPFS, getStoredImage, ipfsToHttp } from '../ipfs'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    clear: jest.fn(() => {
      store = {}
    })
  }
})()

// Mock FileReader
const mockFileReader = {
  result: 'data:image/png;base64,test-image-data',
  readAsDataURL: jest.fn(),
  onload: null as ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null,
  onerror: null as ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

Object.defineProperty(window, 'FileReader', {
  value: jest.fn(() => mockFileReader)
})

// Helper functions to reduce nesting complexity
function simulateFileReaderSuccess() {
  setTimeout(() => {
    if (mockFileReader.onload) {
      mockFileReader.onload.call(mockFileReader, {} as ProgressEvent<FileReader>)
    }
  }, 0)
}

function simulateFileReaderError() {
  setTimeout(() => {
    if (mockFileReader.onerror) {
      mockFileReader.onerror.call(mockFileReader, {} as ProgressEvent<FileReader>)
    }
  }, 0)
}

describe('Updated IPFS Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.clear()
  })

  describe('uploadImageToIPFS', () => {
    it('should store image in localStorage and return file ID', async () => {
      const file = new File(['test'], 'test.png', { type: 'image/png' })
      
      // Mock FileReader behavior
      mockFileReader.readAsDataURL.mockImplementation(simulateFileReaderSuccess)

      const result = await uploadImageToIPFS(file)
      
      expect(result).toMatch(/^user-upload-\d+-test\.png$/)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        `image-${result}`,
        'data:image/png;base64,test-image-data'
      )
    })

    it('should handle file reading errors', async () => {
      const file = new File(['test'], 'test.png', { type: 'image/png' })
      
      mockFileReader.readAsDataURL.mockImplementation(simulateFileReaderError)

      await expect(uploadImageToIPFS(file)).rejects.toThrow('Failed to read file')
    })
  })

  describe('getStoredImage', () => {
    it('should retrieve stored image from localStorage', () => {
      const imageId = 'test-image-id'
      const imageData = 'data:image/png;base64,test-data'
      
      localStorageMock.setItem(`image-${imageId}`, imageData)
      
      const result = getStoredImage(imageId)
      expect(result).toBe(imageData)
      expect(localStorageMock.getItem).toHaveBeenCalledWith(`image-${imageId}`)
    })

    it('should return null for non-existent images', () => {
      const result = getStoredImage('non-existent')
      expect(result).toBeNull()
    })
  })

  describe('ipfsToHttp with localStorage', () => {
    it('should return stored image for user-upload IDs', () => {
      const imageId = 'user-upload-123-test.png'
      const imageData = 'data:image/png;base64,test-data'
      
      localStorageMock.setItem(`image-${imageId}`, imageData)
      
      const result = ipfsToHttp(imageId)
      expect(result).toBe(imageData)
    })

    it('should fall back to IPFS URL for non-stored images', () => {
      const ipfsHash = 'QmTest123'
      const result = ipfsToHttp(ipfsHash)
      expect(result).toBe(`https://ipfs.io/ipfs/${ipfsHash}`)
    })

    it('should handle data URLs', () => {
      const dataUrl = 'data:image/png;base64,test'
      const result = ipfsToHttp(dataUrl)
      expect(result).toBe(dataUrl)
    })
  })
})
