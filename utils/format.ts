import { formatEther, parseEther } from 'viem'

/**
 * Format ETH amount to readable string
 */
export function formatEthAmount(wei: bigint): string {
  const formatted = formatEther(wei)
  // Ensure at least one decimal place for test consistency
  return formatted.includes('.') ? formatted : formatted + '.0'
}

/**
 * Parse ETH amount from string to wei
 */
export function parseEthAmount(eth: string): bigint {
  return parseEther(eth)
}

/**
 * Format wallet address for display
 */
export function formatAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * Format timestamp to readable date
 */
export function formatDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp) * 1000)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format progress percentage
 */
export function formatProgress(raised: bigint, goal: bigint): number {
  if (goal === BigInt(0)) return 0
  return Math.min(Number((raised * BigInt(100)) / goal), 100)
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(num)
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + 'B'
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M'
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Calculate time remaining until timestamp
 */
export function getTimeRemaining(timestamp: bigint): string {
  const now = Math.floor(Date.now() / 1000)
  const target = Number(timestamp)
  const diff = target - now

  if (diff <= 0) return 'Ended'

  const days = Math.floor(diff / (24 * 60 * 60))
  const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((diff % (60 * 60)) / 60)

  if (days > 0) return `${days}d ${hours}h left`
  if (hours > 0) return `${hours}h ${minutes}m left`
  return `${minutes}m left`
} 