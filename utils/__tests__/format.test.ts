import {
  formatEthAmount,
  parseEthAmount,
  formatAddress,
  formatDate,
  formatProgress,
  formatCurrency,
  formatLargeNumber,
  isValidAddress,
  getTimeRemaining,
} from '../format'

describe('Format Utilities', () => {
  describe('formatEthAmount', () => {
    it('should format wei to ETH correctly', () => {
      expect(formatEthAmount(BigInt('1000000000000000000'))).toBe('1.0')
      expect(formatEthAmount(BigInt('500000000000000000'))).toBe('0.5')
      expect(formatEthAmount(BigInt('0'))).toBe('0.0')
    })
  })

  describe('parseEthAmount', () => {
    it('should parse ETH to wei correctly', () => {
      expect(parseEthAmount('1.0')).toBe(BigInt('1000000000000000000'))
      expect(parseEthAmount('0.5')).toBe(BigInt('500000000000000000'))
      expect(parseEthAmount('0')).toBe(BigInt('0'))
    })
  })

  describe('formatAddress', () => {
    it('should format ethereum addresses correctly', () => {
      const address = '0x1234567890123456789012345678901234567890'
      expect(formatAddress(address)).toBe('0x1234...7890')
    })

    it('should handle empty addresses', () => {
      expect(formatAddress('')).toBe('')
    })
  })

  describe('formatDate', () => {
    it('should format timestamps correctly', () => {
      const timestamp = BigInt(1640995200) // Jan 1, 2022 00:00:00 UTC
      const result = formatDate(timestamp)
      // Allow for timezone differences - could be Dec 31 or Jan 1
      expect(result).toMatch(/(Dec 31, 2021|Jan 1, 2022)/)
    })
  })

  describe('formatProgress', () => {
    it('should calculate progress percentage correctly', () => {
      expect(formatProgress(BigInt(50), BigInt(100))).toBe(50)
      expect(formatProgress(BigInt(75), BigInt(100))).toBe(75)
      expect(formatProgress(BigInt(0), BigInt(100))).toBe(0)
      expect(formatProgress(BigInt(100), BigInt(100))).toBe(100)
    })

    it('should cap progress at 100%', () => {
      expect(formatProgress(BigInt(150), BigInt(100))).toBe(100)
    })

    it('should handle zero goal', () => {
      expect(formatProgress(BigInt(50), BigInt(0))).toBe(0)
    })
  })

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00')
      expect(formatCurrency('500.5')).toBe('$500.50')
      expect(formatCurrency(0.123456)).toBe('$0.123456')
    })
  })

  describe('formatLargeNumber', () => {
    it('should format large numbers with suffixes', () => {
      expect(formatLargeNumber(1000)).toBe('1.0K')
      expect(formatLargeNumber(1000000)).toBe('1.0M')
      expect(formatLargeNumber(1000000000)).toBe('1.0B')
      expect(formatLargeNumber(500)).toBe('500')
    })
  })

  describe('isValidAddress', () => {
    it('should validate ethereum addresses correctly', () => {
      expect(isValidAddress('0x1234567890123456789012345678901234567890')).toBe(true)
      expect(isValidAddress('0x0000000000000000000000000000000000000000')).toBe(true)
      expect(isValidAddress('invalid')).toBe(false)
      expect(isValidAddress('0x123')).toBe(false)
      expect(isValidAddress('')).toBe(false)
    })
  })

  describe('getTimeRemaining', () => {
    beforeAll(() => {
      // Mock Date.now() to return a fixed timestamp
      jest.spyOn(Date, 'now').mockReturnValue(1640995200000) // Jan 1, 2022 00:00:00 UTC
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it('should calculate time remaining correctly', () => {
      const futureTimestamp = BigInt(1640995200 + 86400) // +1 day
      expect(getTimeRemaining(futureTimestamp)).toBe('1d 0h left')

      const pastTimestamp = BigInt(1640995200 - 86400) // -1 day
      expect(getTimeRemaining(pastTimestamp)).toBe('Ended')
    })
  })
}) 