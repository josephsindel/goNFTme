import {
  campaignSchema,
  donationSchema,
  sanitizeString,
  sanitizeUrl,
  validateFileUpload,
  validateProductionEnvironment,
  RateLimiter
} from '../validation'

describe('Validation Utilities', () => {
  describe('campaignSchema', () => {
    it('should validate correct campaign data', () => {
      const validCampaign = {
        title: 'Test Campaign',
        description: 'A valid test campaign description',
        goalAmount: '1.5',
        recipientWallet: '0x1234567890123456789012345678901234567890',
        imageUri: 'https://example.com/image.jpg'
      }
      
      expect(() => campaignSchema.parse(validCampaign)).not.toThrow()
    })

    it('should reject campaign with invalid title', () => {
      const invalidCampaign = {
        title: '<script>alert("xss")</script>',
        description: 'Valid description',
        goalAmount: '1.0',
        recipientWallet: '0x1234567890123456789012345678901234567890'
      }
      
      expect(() => campaignSchema.parse(invalidCampaign)).toThrow()
    })

    it('should reject campaign with goal amount too large', () => {
      const invalidCampaign = {
        title: 'Valid Title',
        description: 'Valid description',
        goalAmount: '1001', // Over 1000 ETH
        recipientWallet: '0x1234567890123456789012345678901234567890'
      }
      
      expect(() => campaignSchema.parse(invalidCampaign)).toThrow('Goal amount cannot exceed 1000 ETH')
    })

    it('should reject invalid recipient address', () => {
      const invalidCampaign = {
        title: 'Valid Title',
        description: 'Valid description',
        goalAmount: '1.0',
        recipientWallet: '0x0000000000000000000000000000000000000000' // Zero address
      }
      
      expect(() => campaignSchema.parse(invalidCampaign)).toThrow('Cannot use zero address')
    })
  })

  describe('donationSchema', () => {
    it('should validate correct donation data', () => {
      const validDonation = {
        amount: '0.5',
        campaignId: 1,
        message: 'Great campaign!'
      }
      
      expect(() => donationSchema.parse(validDonation)).not.toThrow()
    })

    it('should validate donation without message', () => {
      const validDonation = {
        amount: '0.5',
        campaignId: 1
      }
      
      expect(() => donationSchema.parse(validDonation)).not.toThrow()
    })

    it('should reject message that is too long', () => {
      const invalidDonation = {
        amount: '0.5',
        campaignId: 1,
        message: 'x'.repeat(201) // Over 200 characters
      }
      
      expect(() => donationSchema.parse(invalidDonation)).toThrow('Message must be less than 200 characters')
    })

    it('should reject donation amount too large', () => {
      const invalidDonation = {
        amount: '101', // Over 100 ETH
        campaignId: 1
      }
      
      expect(() => donationSchema.parse(invalidDonation)).toThrow()
    })
  })

  describe('sanitizeString', () => {
    it('should remove XSS attempts', () => {
      const maliciousInput = '<script>alert("xss")</script>Hello World'
      const sanitized = sanitizeString(maliciousInput)
      expect(sanitized).toBe('Hello World')
      expect(sanitized).not.toContain('<script>')
      expect(sanitized).not.toContain('alert')
    })

    it('should remove event handlers', () => {
      const maliciousInput = 'onclick=alert(1) Hello'
      const sanitized = sanitizeString(maliciousInput)
      expect(sanitized).not.toContain('onclick=')
    })

    it('should handle empty input', () => {
      expect(sanitizeString('')).toBe('')
      expect(sanitizeString(null as any)).toBe('')
    })
  })

  describe('sanitizeUrl', () => {
    it('should allow valid URLs', () => {
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com')
      expect(sanitizeUrl('data:image/png;base64,test')).toBe('data:image/png;base64,test')
      expect(sanitizeUrl('ipfs://QmTest')).toBe('ipfs://QmTest')
    })

    it('should reject javascript URLs', () => {
      expect(sanitizeUrl('javascript:alert(1)')).toBe('')
    })

    it('should reject malicious data URLs', () => {
      expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('')
    })

    it('should reject vbscript URLs', () => {
      expect(sanitizeUrl('vbscript:msgbox(1)')).toBe('')
    })
  })

  describe('validateFileUpload', () => {
    it('should validate correct image files', () => {
      const validFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const result = validateFileUpload(validFile)
      expect(result.valid).toBe(true)
    })

    it('should reject non-image files', () => {
      const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' })
      const result = validateFileUpload(invalidFile)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Invalid file type')
    })

    it('should reject files with malicious names', () => {
      const maliciousFile = new File(['test'], '../../../etc/passwd.jpg', { type: 'image/jpeg' })
      const result = validateFileUpload(maliciousFile)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Invalid filename')
    })

    it('should reject oversized files', () => {
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })
      const result = validateFileUpload(largeFile)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('File size too large')
    })
  })

  describe('RateLimiter', () => {
    let rateLimiter: RateLimiter

    beforeEach(() => {
      rateLimiter = new RateLimiter(3, 1000) // 3 attempts per second
    })

    it('should allow requests under the limit', () => {
      expect(rateLimiter.isRateLimited('user1')).toBe(false)
      expect(rateLimiter.isRateLimited('user1')).toBe(false)
      expect(rateLimiter.isRateLimited('user1')).toBe(false)
    })

    it('should block requests over the limit', () => {
      // Use up the limit
      rateLimiter.isRateLimited('user1')
      rateLimiter.isRateLimited('user1')
      rateLimiter.isRateLimited('user1')
      
      // Should now be rate limited
      expect(rateLimiter.isRateLimited('user1')).toBe(true)
    })

    it('should reset rate limits', () => {
      // Use up the limit
      rateLimiter.isRateLimited('user1')
      rateLimiter.isRateLimited('user1')
      rateLimiter.isRateLimited('user1')
      
      // Reset and should be allowed again
      rateLimiter.reset('user1')
      expect(rateLimiter.isRateLimited('user1')).toBe(false)
    })
  })

  describe('validateProductionEnvironment', () => {
    const originalEnv = process.env

    beforeEach(() => {
      jest.resetModules()
      process.env = { ...originalEnv }
    })

    afterAll(() => {
      process.env = originalEnv
    })

    it('should pass with all required environment variables', () => {
      process.env.NEXT_PUBLIC_ALCHEMY_API_KEY = 'valid_key'
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID = 'valid_project_id'
      process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS = '0x1234567890123456789012345678901234567890'
      
      const result = validateProductionEnvironment()
      expect(result.valid).toBe(true)
      expect(result.issues).toHaveLength(0)
    })

    it('should fail with missing environment variables', () => {
      delete process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
      
      const result = validateProductionEnvironment()
      expect(result.valid).toBe(false)
      expect(result.issues).toContain('Missing NEXT_PUBLIC_ALCHEMY_API_KEY')
    })
  })
}) 