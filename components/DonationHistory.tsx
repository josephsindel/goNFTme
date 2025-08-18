'use client'

import { useState, useEffect } from 'react'
import { useReadContract } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { CONTRACT_ADDRESSES, CAMPAIGN_FACTORY_ABI } from '../lib/web3'
import { formatEthAmount, formatDate } from '../utils/format'
import { useEthToUsd, formatUsd } from '../utils/currency'
import { Trophy, Heart, Clock, User } from 'lucide-react'

interface Donation {
  donor: string
  amount: bigint
  timestamp: bigint
  donorNumber: number
}

interface DonationHistoryProps {
  campaignId: string
  isGoalReached: boolean
  totalDonors: number
}

export function DonationHistory({ campaignId, isGoalReached, totalDonors }: DonationHistoryProps) {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)

  // Get donation token IDs for this campaign
  const { data: donationTokenIds } = useReadContract({
    address: CONTRACT_ADDRESSES[baseSepolia.id] as `0x${string}`,
    abi: CAMPAIGN_FACTORY_ABI,
    functionName: 'getCampaignDonations',
    args: [BigInt(campaignId)],
    chainId: baseSepolia.id,
  })

  // Fetch donation details for each token ID
  useEffect(() => {
    if (donationTokenIds && donationTokenIds.length > 0) {
      const fetchDonations = async () => {
        try {
          const donationPromises = donationTokenIds.map(async (tokenId: bigint) => {
            const response = await fetch(`/api/donation/${tokenId}`)
            if (response.ok) {
              const donation = await response.json()
              return {
                donor: donation.donor,
                amount: BigInt(donation.amount),
                timestamp: BigInt(donation.timestamp),
                donorNumber: donation.donorNumber
              }
            }
            return null
          })

          const donationResults = await Promise.all(donationPromises)
          const validDonations = donationResults.filter(d => d !== null) as Donation[]
          
          // Sort by amount (highest first)
          validDonations.sort((a, b) => {
            if (a.amount > b.amount) return -1
            if (a.amount < b.amount) return 1
            return 0
          })

          setDonations(validDonations)
        } catch (error) {
          console.error('Error fetching donations:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchDonations()
    } else {
      setLoading(false)
    }
  }, [donationTokenIds])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-pink-500" />
          Donation History
        </h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (donations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-pink-500" />
          Donation History
        </h3>
        <div className="text-center py-8">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No donations yet. Be the first to support this campaign!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-pink-500" />
          Donation History
        </h3>
        <div className="flex items-center text-sm text-gray-500">
          <User className="w-4 h-4 mr-1" />
          {totalDonors} {totalDonors === 1 ? 'donor' : 'donors'}
        </div>
      </div>

      {isGoalReached && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <Trophy className="w-5 h-5 text-green-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-green-800">🎉 Campaign Fully Funded!</p>
              <p className="text-xs text-green-600">This campaign has reached its goal and is no longer accepting donations.</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {donations.map((donation, index) => (
          <DonationItem 
            key={`${donation.donor}-${donation.timestamp}`}
            donation={donation}
            rank={index + 1}
            isTopDonor={index === 0 && donations.length > 1}
          />
        ))}
      </div>

      {donations.length > 5 && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Showing top {Math.min(donations.length, 10)} donations
          </p>
        </div>
      )}
    </div>
  )
}

function DonationItem({ donation, rank, isTopDonor }: { 
  donation: Donation; 
  rank: number; 
  isTopDonor: boolean 
}) {
  const ethAmount = formatEthAmount(donation.amount)
  const { usdAmount } = useEthToUsd(ethAmount)

  return (
    <div className={`flex items-center space-x-4 p-3 rounded-lg ${
      isTopDonor ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
    }`}>
      {/* Rank */}
      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
        isTopDonor 
          ? 'bg-yellow-100 text-yellow-800' 
          : rank <= 3 
            ? 'bg-blue-100 text-blue-800'
            : 'bg-gray-200 text-gray-600'
      }`}>
        {isTopDonor ? <Trophy className="w-4 h-4" /> : rank}
      </div>

      {/* Donor Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-gray-900 truncate">
            {donation.donor.slice(0, 6)}...{donation.donor.slice(-4)}
          </p>
          {isTopDonor && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Top Donor
            </span>
          )}
        </div>
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <Clock className="w-3 h-3 mr-1" />
          {formatDate(donation.timestamp)}
        </div>
      </div>

      {/* Amount */}
      <div className="text-right">
        <p className="text-sm font-semibold text-gray-900">
          {ethAmount} ETH
        </p>
        {usdAmount && (
          <p className="text-xs text-gray-500">
            {formatUsd(usdAmount)}
          </p>
        )}
      </div>
    </div>
  )
}
