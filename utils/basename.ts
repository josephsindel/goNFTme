// Base Name resolution utilities
import { createPublicClient, http } from 'viem'
import { base, baseSepolia } from 'viem/chains'

// Base Name Registry contract addresses
const BASE_NAME_REGISTRY = '0x4cCb0BB02FCABA27e82a56646E81d8c5bC4119a5'
const BASE_SEPOLIA_NAME_REGISTRY = '0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA'

// Create public clients for Base networks
const baseClient = createPublicClient({
  chain: base,
  transport: http()
})

const baseSepoliaClient = createPublicClient({
  chain: baseSepolia,
  transport: http()
})

/**
 * Resolve a Base name (e.g., 'joesindel.cb.id') to an Ethereum address
 */
export async function resolveBaseName(name: string, network: 'base' | 'base-sepolia' = 'base'): Promise<string | null> {
  try {
    const client = network === 'base' ? baseClient : baseSepoliaClient
    const registryAddress = network === 'base' ? BASE_NAME_REGISTRY : BASE_SEPOLIA_NAME_REGISTRY
    
    // For now, we'll use a hardcoded mapping until we implement full ENS resolution
    // This is because Base names use a different resolution mechanism
    const knownAddresses: Record<string, string> = {
      'joesindel.cb.id': '0xe3AecF968f7395192e1fE7fe373f4Af63bE7d756', // Your wallet address
      // Add more mappings as needed
    }
    
    if (knownAddresses[name]) {
      return knownAddresses[name]
    }
    
    // TODO: Implement full Base name resolution
    // This would involve calling the Base Name Registry contract
    console.warn(`Base name resolution not implemented for: ${name}`)
    return null
    
  } catch (error) {
    console.error('Error resolving Base name:', error)
    return null
  }
}

/**
 * Format an address for display (show first 6 and last 4 characters)
 */
export function formatAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * Check if a string is a valid Base name
 */
export function isValidBaseName(name: string): boolean {
  return name.endsWith('.cb.id') && name.length > 6
}

/**
 * Get the display name for an address (Base name if available, otherwise formatted address)
 */
export function getDisplayName(address: string, baseName?: string): string {
  if (baseName && isValidBaseName(baseName)) {
    return baseName
  }
  return formatAddress(address)
}
