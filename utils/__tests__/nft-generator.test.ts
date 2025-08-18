import { 
  generateCreatorNFT, 
  generateDonorNFT, 
  resolveAddressName,
  generateCampaignUrl
} from '../nft-generator'

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    origin: 'http://localhost:3000'
  },
  writable: true
})

describe('NFT Generator', () => {
  describe('generateCreatorNFT', () => {
    it('generates creator NFT metadata with all required fields', () => {
      const result = generateCreatorNFT(
        'Test Campaign',
        'A test campaign description',
        'test-image-uri',
        '0x1234567890123456789012345678901234567890',
        '1',
        '1.0'
      )

      expect(result.name).toContain('Campaign Creator')
      expect(result.name).toContain('Test Campaign')
      expect(result.description).toContain('creating')
      expect(result.description).toContain('Test Campaign')
      expect(result.image).toContain('data:image/svg+xml')
      expect(result.attributes).toEqual(expect.arrayContaining([
        expect.objectContaining({ trait_type: 'Role', value: 'Campaign Creator' }),
        expect.objectContaining({ trait_type: 'Campaign Title', value: 'Test Campaign' }),
        expect.objectContaining({ trait_type: 'Goal Amount', value: '1.0 ETH' })
      ]))
    })

    it('includes creator name when provided', () => {
      const result = generateCreatorNFT(
        'Test Campaign',
        'A test campaign description',
        'test-image-uri',
        '0x1234567890123456789012345678901234567890',
        '1',
        '1.0',
        'Alice'
      )

      expect(result.description).toContain('Alice')
    })
  })

  describe('generateDonorNFT', () => {
    it('generates donor NFT metadata with all required fields', () => {
      const result = generateDonorNFT(
        'Test Campaign',
        'test-image-uri',
        '0x1234567890123456789012345678901234567890',
        '0.1',
        '1'
      )

      expect(result.name).toContain('Donation NFT')
      expect(result.name).toContain('Test Campaign')
      expect(result.description).toContain('donation')
      expect(result.description).toContain('Test Campaign')
      expect(result.image).toContain('data:image/svg+xml')
      expect(result.attributes).toEqual(expect.arrayContaining([
        expect.objectContaining({ trait_type: 'Role', value: 'Generous Donor' }),
        expect.objectContaining({ trait_type: 'Campaign Title', value: 'Test Campaign' })
      ]))
    })

    it('includes donation message when provided', () => {
      const result = generateDonorNFT(
        'Test Campaign',
        'test-image-uri',
        '0x1234567890123456789012345678901234567890',
        '0.1',
        '1',
        'Great cause!',
        'Bob'
      )

      expect(result.description).toContain('Great cause!')
      expect(result.description).toContain('Bob')
    })
  })

  describe('resolveAddressName', () => {
    it('returns null for unresolved addresses', async () => {
      const result = await resolveAddressName('0x1234567890123456789012345678901234567890')
      expect(result).toBeNull()
    })
  })

  describe('generateCampaignUrl', () => {
    it('generates URL with window.location.origin', () => {
      const result = generateCampaignUrl('123')
      expect(result).toBe('http://localhost:3000/campaign/123')
    })

    it('falls back to production URL when window is undefined', () => {
      const originalWindow = global.window
      delete (global as any).window

      const result = generateCampaignUrl('123')
      expect(result).toBe('https://gonftme.app/campaign/123')

      global.window = originalWindow
    })
  })
})