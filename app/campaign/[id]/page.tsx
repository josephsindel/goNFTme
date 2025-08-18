'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESSES, CAMPAIGN_FACTORY_ABI } from '../../../lib/web3'
import { baseSepolia } from 'wagmi/chains'
import { Campaign } from '../../../types'
import { formatEthAmount, formatProgress, formatAddress, formatDate, parseEthAmount } from '../../../utils/format'

import { useEthToUsd, formatUsd } from '../../../utils/currency'
import { donationSchema, sanitizeString } from '../../../utils/validation'
// NFT generation imports removed - using simplified approach
import { ConnectWallet } from '../../../components/ConnectWallet'
import { NetworkSwitcher } from '../../../components/NetworkSwitcher'
import { DonationHistory } from '../../../components/DonationHistory'
import Link from 'next/link'
import { SafeImage } from '../../../components/SafeImage'
import { ArrowLeft, Users, Target, Calendar, Wallet, Heart } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { validateWalletConnection, handleContractError, handleTransactionSuccess } from '../../../utils/wallet'
import { generateSimpleDonorSVG } from '../../../utils/nft-generator'

// Helper function to create donor NFT metadata with dynamic image
async function createDonorNFTMetadata(
  foundCampaign: Campaign,
  donationAmount: string,
  campaignId: string,
  address: string,
  sanitizedMessage: string
) {
  // Use the campaign image directly
  const dynamicImage = foundCampaign.imageUri

  return JSON.stringify({
    name: `Donor-${campaignId}`,
    image: dynamicImage,
    role: "donor"
  })
}

// Loading component
function LoadingSpinner({ message }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
        {message && <p className="text-gray-600">{message}</p>}
      </div>
    </div>
  )
}

// Error component
function CampaignError({ error, isError }: { error?: Error | null, isError: boolean }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Campaign Not Found</h1>
        <p className="text-gray-600 mb-8">
          {isError ? `Error: ${error?.message}` : 'This campaign does not exist or has been removed.'}
        </p>
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default function CampaignDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)
  const [donationAmount, setDonationAmount] = useState('')
  const [donationMessage, setDonationMessage] = useState('')

  const campaignId = params?.id as string

  // USD conversion for donation amount - must be called before any returns
  const { usdAmount: donationUsdAmount, loading: donationUsdLoading } = useEthToUsd(donationAmount)

  // Fetch campaign details
  const { data: campaigns, isLoading, isError, error } = useReadContract({
    address: CONTRACT_ADDRESSES[baseSepolia.id] as `0x${string}`,
    abi: CAMPAIGN_FACTORY_ABI,
    functionName: 'getActiveCampaigns',
    chainId: baseSepolia.id,
  })

  // Find the specific campaign
  const foundCampaign = campaigns?.find((c: Campaign) => c.id.toString() === campaignId)

  // USD conversions - must be called before any early returns
  const raisedEth = foundCampaign ? formatEthAmount(foundCampaign.raisedAmount) : '0'
  const goalEth = foundCampaign ? formatEthAmount(foundCampaign.goalAmount) : '0'
  const { usdAmount: raisedUsd } = useEthToUsd(raisedEth)
  const { usdAmount: goalUsd } = useEthToUsd(goalEth)

  // Donation transaction
  const { 
    writeContract, 
    data: hash,
    isPending: isDonating,
    error: donateError 
  } = useWriteContract()

  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    error: confirmError 
  } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle donation success
  useEffect(() => {
    if (isConfirmed) {
      handleTransactionSuccess('🎉 Donation successful! Your NFT has been minted!', () => {
        setDonationAmount('')
        setDonationMessage('')
        router.refresh()
      })
    }
  }, [isConfirmed, router])

  // Handle donation errors
  useEffect(() => {
    if (donateError) {
      toast.dismiss('donation-toast')
      
      // Check for user rejection
      if (donateError.message.includes('User rejected') || 
          donateError.message.includes('User denied') ||
          donateError.message.includes('user rejected') ||
          donateError.message.includes('cancelled')) {
        toast.error('Transaction cancelled by user')
      } else {
        handleContractError(donateError, 'Donation')
      }
    }
  }, [donateError])

  // Handle confirmation errors
  useEffect(() => {
    if (confirmError) {
      toast.dismiss('donation-toast')
      handleContractError(confirmError, 'Transaction confirmation')
    }
  }, [confirmError])

  if (!mounted) {
    return <LoadingSpinner />
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading campaign..." />
  }

  if (isError || !foundCampaign) {
    return <CampaignError error={error} isError={isError} />
  }

  const progress = formatProgress(foundCampaign.raisedAmount, foundCampaign.goalAmount)

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateWalletConnection(isConnected, address)) return

    try {
      // Validate donation
      const validation = donationSchema.safeParse({
        amount: donationAmount,
        campaignId: parseInt(campaignId),
        message: donationMessage
      })

      if (!validation.success) {
        toast.error(validation.error.errors[0].message)
        return
      }

      // Show loading for NFT generation
      toast.loading('Generating your NFT...', { id: 'donation-toast' })

      // Sanitize the message and create NFT metadata (with security logging)
      const sanitizedMessage = sanitizeString(donationMessage.trim(), 'donation')
      
      // Generate the dynamic NFT metadata with image BEFORE the transaction
      const tokenUri = await createDonorNFTMetadata(
        foundCampaign,
        donationAmount,
        campaignId,
        address!,
        sanitizedMessage
      )

      // Update loading message
      toast.loading('Processing donation...', { id: 'donation-toast' })

      writeContract({
        address: CONTRACT_ADDRESSES[baseSepolia.id] as `0x${string}`,
        abi: CAMPAIGN_FACTORY_ABI,
        functionName: 'donate',
        args: [BigInt(campaignId), tokenUri],
        value: parseEthAmount(donationAmount),
        chainId: baseSepolia.id,
        gas: 600000n, // Increased gas limit for NFT generation
      })
    } catch (error) {
      handleContractError(error, 'Donation')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link 
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Campaigns</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Campaign Details */}
          <div className="space-y-6">
            {/* Campaign Image */}
            <div className="relative h-80 rounded-lg overflow-hidden bg-gray-100">
              <SafeImage 
                src={foundCampaign.imageUri}
                alt={foundCampaign.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                fallbackIcon={<Target className="w-16 h-16 text-gray-400" />}
              />
            </div>

            {/* Campaign Info */}
            <div className="card">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{foundCampaign.title}</h1>
              <p className="text-gray-700 mb-6 whitespace-pre-wrap">{foundCampaign.description}</p>

              {/* Progress */}
              <div className="space-y-4">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {raisedEth} ETH
                    </div>
                    {raisedUsd && (
                      <div className="text-sm text-gray-500">
                        {formatUsd(raisedUsd)}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-gray-600">
                      of {goalEth} ETH
                    </div>
                    {goalUsd && (
                      <div className="text-sm text-gray-500">
                        {formatUsd(goalUsd)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-lg font-semibold text-primary-600">
                    {progress}% funded
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {foundCampaign.totalDonors.toString()}
                  </div>
                  <div className="text-sm text-gray-600">donors</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Target className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatAddress(foundCampaign.creator)}
                  </div>
                  <div className="text-sm text-gray-600">creator</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatDate(foundCampaign.createdAt)}
                  </div>
                  <div className="text-sm text-gray-600">created</div>
                </div>
              </div>
            </div>
          </div>

          {/* Donation Form */}
          <div className="space-y-6">
            <NetworkSwitcher />
            
            {/* Check if campaign is fully funded */}
            {progress >= 100 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Target className="w-5 h-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-green-800">🎉 Campaign Successfully Funded!</p>
                    <p className="text-xs text-green-600">This campaign has reached its goal and is no longer accepting donations.</p>
                  </div>
                </div>
              </div>
            )}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                Support This Campaign
              </h2>

              {!isConnected ? (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">Connect your wallet to make a donation</p>
                  <ConnectWallet />
                </div>
              ) : (
                <>
                  {progress >= 100 ? (
                    <div className="text-center py-8">
                      <Target className="w-12 h-12 text-green-500 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">This campaign has reached its funding goal!</p>
                      <p className="text-sm text-gray-500">Thank you to all the generous donors who made this possible.</p>
                    </div>
                  ) : (
                <form onSubmit={handleDonate} className="space-y-4">
                  {/* Donation Amount */}
                  <div>
                    <label htmlFor="donation-amount" className="block text-sm font-medium text-gray-700 mb-2">
                      <Wallet className="w-4 h-4 inline mr-2" />
                      Donation Amount (ETH) *
                    </label>
                    <div className="space-y-2">
                      <input
                        id="donation-amount"
                        type="number"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        placeholder="0.001"
                        step="0.000000000000000001"
                        min="0.000000000000000001"
                        className="input-field"
                        required
                      />
                      {donationUsdAmount && !donationUsdLoading && (
                        <p className="text-sm text-gray-500">
                          ≈ {formatUsd(donationUsdAmount)} USD
                        </p>
                      )}
                      {donationUsdLoading && donationAmount && (
                        <p className="text-sm text-gray-400">Converting to USD...</p>
                      )}
                    </div>
                  </div>

                  {/* Optional Message */}
                  <div>
                    <label htmlFor="donation-message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message (Optional)
                    </label>
                    <textarea
                      id="donation-message"
                      value={donationMessage}
                      onChange={(e) => setDonationMessage(e.target.value)}
                      placeholder="Leave a message of support..."
                      rows={3}
                      className="input-field resize-none"
                      maxLength={200}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This message will be included in your donation NFT
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isDonating || isConfirming || !donationAmount}
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    {isDonating || isConfirming ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>
                          {isDonating ? 'Processing...' : 'Confirming...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4" />
                        <span>Donate & Get NFT</span>
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    You&apos;ll receive a unique NFT as a thank you for your donation
                  </p>
                </form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Donation History Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DonationHistory 
            campaignId={campaignId}
            isGoalReached={progress >= 100}
            totalDonors={Number(foundCampaign.totalDonors)}
          />
        </div>
      </div>
    </div>
  )
}