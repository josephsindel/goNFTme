'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { formatAddress } from '../utils/format'
import { Wallet, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ConnectWallet() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [mounted, setMounted] = useState(false)

  // Fix hydration by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch by showing loading state until mounted
  if (!mounted) {
    return (
      <div className="flex items-center space-x-2">
        <div className="btn-primary flex items-center space-x-2 opacity-50">
          <Wallet className="w-4 h-4" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 bg-primary-50 text-primary-700 px-3 py-2 rounded-lg">
          <Wallet className="w-4 h-4" />
          <span className="font-medium">{formatAddress(address)}</span>
        </div>
        <button
          onClick={() => disconnect()}
          className="p-2 text-gray-500 hover:text-red-600 transition-colors"
          title="Disconnect"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex space-x-2">
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          disabled={isPending}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50"
        >
          <Wallet className="w-4 h-4" />
          <span>{isPending ? 'Connecting...' : `Connect ${connector.name}`}</span>
        </button>
      ))}
    </div>
  )
} 