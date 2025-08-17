'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { formatAddress } from '../utils/format'
import { Wallet, LogOut, ChevronDown, Copy, ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

export function ConnectWallet() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [mounted, setMounted] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  // Fix hydration by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success('Address copied to clipboard!')
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setShowDropdown(false)
    toast.success('Wallet disconnected')
  }

  // Prevent hydration mismatch by showing loading state until mounted
  if (!mounted) {
    return (
      <div className="flex items-center">
        <div className="bg-gradient-to-r from-primary-500 to-base-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 opacity-75">
          <div className="w-4 h-4 rounded-full bg-white/30 animate-pulse" />
          <span className="hidden sm:inline">Loading...</span>
        </div>
      </div>
    )
  }

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
          <Wallet className="w-4 h-4" />
          <span className="font-medium hidden sm:inline">{formatAddress(address)}</span>
          <span className="font-medium sm:hidden">Connected</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        </button>

        {showDropdown && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowDropdown(false)}
            />
            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border z-20 py-2">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm text-gray-500">Connected Wallet</p>
                <p className="font-mono text-sm text-gray-900 mt-1 break-all">{address}</p>
              </div>
              
              <button
                onClick={handleCopyAddress}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-gray-700"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Address</span>
              </button>
              
              <a
                href={`https://basescan.org/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-gray-700"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View on BaseScan</span>
              </a>
              
              <div className="border-t border-gray-100 mt-2">
                <button
                  onClick={handleDisconnect}
                  className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center space-x-2 text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Disconnect</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isPending}
        className="bg-gradient-to-r from-primary-600 to-base-600 hover:from-primary-700 hover:to-base-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Wallet className="w-4 h-4" />
        <span className="font-medium">
          {isPending ? 'Connecting...' : 'Connect Wallet'}
        </span>
        {!isPending && <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />}
      </button>

      {showDropdown && !isPending && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          />
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border z-20 py-2">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">Choose Wallet</p>
              <p className="text-xs text-gray-500">Connect to start using the app</p>
            </div>
            
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => {
                  connect({ connector })
                  setShowDropdown(false)
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-base-100 rounded-lg flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium">{connector.name}</p>
                  <p className="text-xs text-gray-500">
                    {connector.name === 'Coinbase Wallet' && 'Recommended'}
                    {connector.name === 'Injected' && 'Browser wallet'}
                    {connector.name === 'WalletConnect' && 'Scan with phone'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
} 