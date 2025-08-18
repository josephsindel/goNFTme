import { formatUsd } from '../currency'

// Mock fetch for testing
global.fetch = jest.fn()

describe('Currency utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Clear the cache by accessing the module internals
    jest.resetModules()
  })

  describe('getEthPrice', () => {
    it('should fetch ETH price from API', async () => {
      const { getEthPrice } = require('../currency')
      const mockResponse = {
        ethereum: { usd: 2500 }
      }
      
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })

      const price = await getEthPrice()
      expect(price).toBe(2500)
      expect(fetch).toHaveBeenCalledWith('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
    })

    it('should return fallback price when API fails', async () => {
      const { getEthPrice } = require('../currency')
      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'))

      const price = await getEthPrice()
      expect(price).toBe(2500) // fallback price
    })
  })

  describe('ethToUsd', () => {
    it('should convert ETH string to USD', async () => {
      const { ethToUsd } = require('../currency')
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve({ ethereum: { usd: 2000 } })
      })

      const usd = await ethToUsd('0.5')
      expect(usd).toBe(1000) // 0.5 * 2000
    })

    it('should convert ETH number to USD', async () => {
      const { ethToUsd } = require('../currency')
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve({ ethereum: { usd: 2000 } })
      })

      const usd = await ethToUsd(0.25)
      expect(usd).toBe(500) // 0.25 * 2000
    })

    it('should return 0 for invalid input', async () => {
      const { ethToUsd } = require('../currency')
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve({ ethereum: { usd: 2000 } })
      })

      const usd = await ethToUsd('invalid')
      expect(usd).toBe(0)
    })
  })

  describe('formatUsd', () => {
    it('should format USD amounts correctly', () => {
      expect(formatUsd(1234.56)).toBe('$1,234.56')
      expect(formatUsd(0.99)).toBe('$0.99')
      expect(formatUsd(1000000)).toBe('$1,000,000.00')
    })

    it('should handle very small amounts', () => {
      expect(formatUsd(0.001)).toBe('$0.00')
      expect(formatUsd(0)).toBe('$0.00')
    })

    it('should handle large amounts', () => {
      expect(formatUsd(999999999)).toBe('$999,999,999.00')
    })
  })
})
