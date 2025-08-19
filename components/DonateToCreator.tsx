'use client'

import { useState, useEffect } from 'react'
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { Heart, Coffee, Zap, ExternalLink } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { resolveBaseName } from '../utils/basename'

interface DonateToCreatorProps {
  className?: string
  variant?: 'button' | 'card' | 'banner'
}

export function DonateToCreator({ className = '', variant = 'button' }: DonateToCreatorProps) {
  const [amount, setAmount] = useState('0.001')
  const [isOpen, setIsOpen] = useState(false)
  const { address, isConnected } = useAccount()
  const { sendTransaction, data: hash, isPending } = useSendTransaction()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  const creatorAddress = '0xe3AecF968f7395192e1fE7fe373f4Af63bE7d756' // joesindel.cb.id
  const baseName = 'joesindel.cb.id'

  // Handle transaction confirmation
  useEffect(() => {
    if (hash && !isConfirming && !isPending) {
      toast.success(`Thank you! Donation sent successfully! 🎉`)
      setIsOpen(false) // Close modal on success
      setAmount('0.001') // Reset amount
    }
  }, [hash, isConfirming, isPending])

  const handleDonate = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    try {
      const value = parseEther(amount)
      
      // Send ETH directly to the Base name
      sendTransaction({
        to: creatorAddress as `0x${string}`,
        value,
      })

      toast.success(`Sending ${amount} ETH to ${baseName}...`)
    } catch (error) {
      console.error('Donation error:', error)
      toast.error('Donation failed. Please try again.')
    }
  }

  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-10 h-10 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Support GoNFTme Development</h3>
              <p className="text-xs text-gray-600">This platform is free & open-source. No fees taken from campaigns.</p>
            </div>
          </div>
          <button
            onClick={() => {
              console.log('Coffee button clicked!')
              setIsOpen(true)
            }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center space-x-2"
          >
            <Coffee className="w-4 h-4" />
            <span>Buy me a coffee</span>
          </button>
        </div>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}>
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Support the Platform</h3>
          <p className="text-gray-600 text-sm mb-4">
            GoNFTme is completely free with no platform fees. If you find it useful, consider supporting development.
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center space-x-2 mx-auto"
          >
            <Zap className="w-4 h-4" />
            <span>Donate ETH</span>
          </button>
        </div>
      </div>
    )
  }

  // Button variant
  return (
    <>
      <button
        onClick={() => {
          console.log('Support Platform button clicked!')
          setIsOpen(true)
        }}
        className={`bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center space-x-2 ${className}`}
      >
        <Heart className="w-4 h-4" />
        <span>Support Platform</span>
      </button>

      {/* Donation Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Support GoNFTme</h3>
              <p className="text-gray-600 text-sm">
                Thank you for supporting this free, open-source platform! 🙏
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Donation Amount (ETH)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    step="0.001"
                    min="0.001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.001"
                  />
                  <div className="absolute right-3 top-2 text-sm text-gray-500">ETH</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Recipient:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-blue-600">{baseName}</span>
                    <ExternalLink className="w-3 h-3 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDonate}
                  disabled={isPending || isConfirming || !isConnected}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isPending || isConfirming ? 'Sending...' : 'Send Donation'}
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                💡 100% of your donation goes directly to the developer. No platform fees!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
