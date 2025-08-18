import { useState, useEffect } from 'react'

/**
 * Currency conversion utilities for ETH to USD
 */

// Simple in-memory cache for ETH price
let ethPriceCache: { price: number; timestamp: number } | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Fetches current ETH price from a free API
 */
export async function getEthPrice(): Promise<number> {
  // Check cache first
  if (ethPriceCache && Date.now() - ethPriceCache.timestamp < CACHE_DURATION) {
    return ethPriceCache.price
  }

  try {
    // Using CoinGecko's free API (no API key required)
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
    const data = await response.json()
    
    if (data.ethereum?.usd) {
      const price = data.ethereum.usd
      ethPriceCache = { price, timestamp: Date.now() }
      return price
    }
    
    throw new Error('Invalid API response')
  } catch (error) {
    // Silently fail and use cached price if available
    // Fallback to a reasonable default if API fails
    return 2500 // Approximate ETH price as fallback
  }
}

/**
 * Converts ETH amount to USD
 */
export async function ethToUsd(ethAmount: string | number): Promise<number> {
  const ethPrice = await getEthPrice()
  const amount = typeof ethAmount === 'string' ? parseFloat(ethAmount) : ethAmount
  
  if (isNaN(amount)) return 0
  
  return amount * ethPrice
}

/**
 * Formats USD amount with proper currency symbol
 */
export function formatUsd(amount: number): string {
  if (amount < 0.01) return '$0.00'
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Component hook for real-time ETH to USD conversion
 */
export function useEthToUsd(ethAmount: string | number) {
  const [usdAmount, setUsdAmount] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!ethAmount || ethAmount === '' || ethAmount === '0') {
      setUsdAmount(null)
      return
    }

    setLoading(true)
    
    const convertAmount = async () => {
      try {
        const usd = await ethToUsd(ethAmount)
        setUsdAmount(usd)
      } catch (error) {
        // Error handling - return null for failed conversions
        setUsdAmount(null)
      } finally {
        setLoading(false)
      }
    }

    // Debounce the conversion to avoid too many API calls
    const timeoutId = setTimeout(convertAmount, 500)
    
    return () => clearTimeout(timeoutId)
  }, [ethAmount])

  return { usdAmount, loading }
}
