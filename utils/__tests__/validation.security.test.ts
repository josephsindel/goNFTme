import { 
  sanitizeString, 
  sanitizeUrl, 
  validateFileUpload,
  validateProductionEnvironment,
  RateLimiter,
  getCSPHeader
} from '../validation'

describe('Security Validation Functions', () => {
  describe('sanitizeString', () => {
    it('should remove script tags', () => {
      const malicious = '<script>alert("xss")</script>Hello'
      expect(sanitizeString(malicious)).toBe('Hello')
    })

    it('should remove javascript: protocol', () => {
      const malicious = 'javascript:alert(xss)Hello'
      expect(sanitizeString(malicious)).toBe('alert(xss)Hello')
    })

    it('should remove event handlers', () => {
      const malicious = 'onclick=alert(xss)Hello'
      expect(sanitizeString(malicious)).toBe('alert(xss)Hello')
    })

    it('should remove HTML tags', () => {
      const malicious = '<div>Hello</div><span>World</span>'
      expect(sanitizeString(malicious)).toBe('HelloWorld')
    })

    it('should remove dangerous protocols', () => {
      const malicious = 'vbscript:alert(xss) data:text/html,dangerous Hello'
      expect(sanitizeString(malicious)).toBe('alert(xss) text/html,dangerous Hello')
    })

    it('should remove quotes and dangerous characters', () => {
      const malicious = 'Hello"World\'Test<script>'
      expect(sanitizeString(malicious)).toBe('HelloWorldTest')
    })

    it('should handle empty strings', () => {
      expect(sanitizeString('')).toBe('')
    })
  })

  describe('sanitizeUrl', () => {
    it('should allow https URLs', () => {
      const url = 'https://example.com/image.jpg'
      expect(sanitizeUrl(url)).toBe(url)
    })

    it('should allow http URLs', () => {
      const url = 'http://localhost:3000/image.jpg'
      expect(sanitizeUrl(url)).toBe(url)
    })

    it('should allow data URLs', () => {
      const url = 'data:image/png;base64,test'
      expect(sanitizeUrl(url)).toBe(url)
    })

    it('should allow ipfs URLs', () => {
      const url = 'ipfs://QmTest123'
      expect(sanitizeUrl(url)).toBe(url)
    })

    it('should reject javascript: URLs', () => {
      const malicious = 'javascript:alert("xss")'
      expect(sanitizeUrl(malicious)).toBe('')
    })

    it('should reject malicious data URLs', () => {
      const malicious = 'data:text/html,<script>alert("xss")</script>'
      expect(sanitizeUrl(malicious)).toBe('')
    })

    it('should reject ftp URLs', () => {
      const url = 'ftp://example.com/file.txt'
      expect(sanitizeUrl(url)).toBe('')
    })
  })

  describe('validateFileUpload', () => {
    it('should accept valid image files', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const result = validateFileUpload(file)
      expect(result.valid).toBe(true)
    })

    it('should reject non-image files', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' })
      const result = validateFileUpload(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Invalid file type')
    })

    it('should reject files that are too large', () => {
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })
      const result = validateFileUpload(largeFile)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('File size too large')
    })

    it('should reject malicious filenames', () => {
      const file = new File(['test'], '../../../etc/passwd', { type: 'image/jpeg' })
      const result = validateFileUpload(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Invalid file extension')
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

    it('should pass with all required env vars', () => {
      process.env.NEXT_PUBLIC_ALCHEMY_API_KEY = 'test-key'
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID = 'test-project'
      process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS = '0x1234567890123456789012345678901234567890'
      
      const result = validateProductionEnvironment()
      expect(result.valid).toBe(true)
      expect(result.issues).toHaveLength(0)
    })

    it('should fail with missing env vars', () => {
      delete process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
      
      const result = validateProductionEnvironment()
      expect(result.valid).toBe(false)
      expect(result.issues).toContain('Missing NEXT_PUBLIC_ALCHEMY_API_KEY')
    })
  })

  describe('RateLimiter', () => {
    it('should allow requests within limit', () => {
      const limiter = new RateLimiter(5, 60000)
      
      expect(limiter.isRateLimited('user1')).toBe(false)
      expect(limiter.isRateLimited('user1')).toBe(false)
    })

    it('should rate limit after max attempts', () => {
      const limiter = new RateLimiter(2, 60000)
      
      expect(limiter.isRateLimited('user1')).toBe(false)
      expect(limiter.isRateLimited('user1')).toBe(false)
      expect(limiter.isRateLimited('user1')).toBe(true)
    })

    it('should reset rate limit', () => {
      const limiter = new RateLimiter(1, 60000)
      
      limiter.isRateLimited('user1')
      limiter.isRateLimited('user1') // Should be rate limited
      
      limiter.reset('user1')
      expect(limiter.isRateLimited('user1')).toBe(false)
    })
  })

  describe('getCSPHeader', () => {
    it('should return a valid CSP header string', () => {
      const csp = getCSPHeader()
      
      expect(csp).toContain("default-src 'self'")
      expect(csp).toContain("script-src 'self'")
      expect(csp).toContain("style-src 'self'")
    })

    it('should include necessary directives for Next.js', () => {
      const csp = getCSPHeader()
      
      expect(csp).toContain("'unsafe-eval'") // Required for Next.js
      expect(csp).toContain("'unsafe-inline'") // Required for styles
    })
  })
})
