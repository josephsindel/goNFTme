import {
  generateNFTMetadata,
  uploadMetadataToIPFS,
  ipfsToHttp,
  validateImageFile,
} from '../ipfs'

describe('IPFS Utilities', () => {
  describe('generateNFTMetadata', () => {
    it('should generate correct NFT metadata', () => {
      const metadata = generateNFTMetadata(
        'Test Campaign',
        '1.0',
        1,
        1,
        'https://example.com/image.jpg',
        '2022-01-01',
        '0.0'
      )

      expect(metadata.name).toBe('Test Campaign - Donation #1')
      expect(metadata.description).toContain('Test Campaign')
      expect(metadata.image).toBe('https://example.com/image.jpg')
      expect(metadata.attributes).toHaveLength(7)
      expect(metadata.attributes[6].value).toBe('1 of 1 - Unique')
    })

    it('should handle multiple donors correctly', () => {
      const metadata = generateNFTMetadata(
        'Test Campaign',
        '0.1',
        5,
        10,
        'https://example.com/image.jpg',
        '2022-01-01',
        '0.5'
      )

      expect(metadata.attributes[6].value).toBe('5 of 10')
    })
  })

  describe('uploadMetadataToIPFS', () => {
    it('should create data URL from metadata', async () => {
      const metadata = { name: 'Test', description: 'Test NFT' }
      const result = await uploadMetadataToIPFS(metadata)
      
      expect(result).toMatch(/^data:application\/json;base64,/)
      
      // Decode and verify the content
      const base64Data = result.split(',')[1]
      const decodedData = JSON.parse(atob(base64Data))
      expect(decodedData).toEqual(metadata)
    })
  })

  describe('ipfsToHttp', () => {
    it('should convert IPFS hashes to HTTP URLs', () => {
      expect(ipfsToHttp('QmTest123')).toBe('https://ipfs.io/ipfs/QmTest123')
      expect(ipfsToHttp('bafTest123')).toBe('https://ipfs.io/ipfs/bafTest123')
      expect(ipfsToHttp('ipfs://QmTest123')).toBe('https://ipfs.io/ipfs/QmTest123')
    })

    it('should return data URLs unchanged', () => {
      const dataUrl = 'data:image/png;base64,test'
      expect(ipfsToHttp(dataUrl)).toBe(dataUrl)
    })

    it('should return regular URLs unchanged', () => {
      const url = 'https://example.com/image.jpg'
      expect(ipfsToHttp(url)).toBe(url)
    })
  })

  describe('validateImageFile', () => {
    it('should validate correct image files', () => {
      const validFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const result = validateImageFile(validFile)
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject invalid file types', () => {
      const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' })
      const result = validateImageFile(invalidFile)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('valid image file')
    })

    it('should reject files that are too large', () => {
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'test.jpg', { 
        type: 'image/jpeg' 
      })
      const result = validateImageFile(largeFile)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('5MB')
    })

    it('should accept all valid image types', () => {
      const types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      
      types.forEach(type => {
        const file = new File(['test'], `test.${type.split('/')[1]}`, { type })
        const result = validateImageFile(file)
        expect(result.valid).toBe(true)
      })
    })
  })
}) 