'use client'

import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { AlertTriangle, Zap } from 'lucide-react'

export function NetworkSwitcher() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()

  if (!isConnected || chainId === baseSepolia.id) {
    return null // Don't show if not connected or already on correct network
  }

  const handleSwitchNetwork = () => {
    switchChain({ chainId: baseSepolia.id })
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800 mb-1">
            Wrong Network Detected
          </h3>
          <p className="text-sm text-yellow-700 mb-3">
            You&apos;re currently connected to <strong>{getNetworkName(chainId)}</strong> but this app requires <strong>Base Sepolia Testnet</strong> to function properly.
          </p>
          <button
            onClick={handleSwitchNetwork}
            disabled={isPending}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Switching...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Switch to Base Sepolia
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function getNetworkName(chainId: number): string {
  switch (chainId) {
    case 1: return 'Ethereum Mainnet'
    case 5: return 'Goerli Testnet'
    case 11155111: return 'Sepolia Testnet'
    case 8453: return 'Base Mainnet'
    case 84532: return 'Base Sepolia Testnet'
    case 137: return 'Polygon'
    case 80001: return 'Polygon Mumbai'
    default: return `Chain ${chainId}`
  }
}
