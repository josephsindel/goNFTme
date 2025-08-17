'use client'

import { useState, useEffect } from 'react'
import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESSES, CAMPAIGN_FACTORY_ABI } from '../lib/web3'
import { base } from 'wagmi/chains'
import { Campaign } from '../types'
import { formatEthAmount, formatProgress, formatAddress } from '../utils/format'
import Link from 'next/link'
import { Plus, Target, Users, Calendar } from 'lucide-react'
import { ConnectWallet } from '../components/ConnectWallet'
import { CampaignCard } from '../components/CampaignCard'

export default function HomePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])

  // Read active campaigns from contract
  const { data: activeCampaigns, isError, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES[base.id] as `0x${string}`,
    abi: CAMPAIGN_FACTORY_ABI,
    functionName: 'getActiveCampaigns',
    chainId: base.id,
  })

  useEffect(() => {
    if (activeCampaigns) {
      setCampaigns(activeCampaigns as Campaign[])
    }
  }, [activeCampaigns])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gradient">GoNFTme</h1>
              <span className="ml-2 text-sm text-gray-500">Web3 Crowdfunding</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/create"
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Campaign</span>
              </Link>
              <ConnectWallet />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Crowdfunding with{' '}
            <span className="text-gradient">NFT Rewards</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create campaigns, receive donations, and mint unique NFTs for every contributor. 
            Built on Base blockchain for fast, secure, and affordable transactions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              href="/create"
              className="btn-primary px-8 py-3 text-lg flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Start Your Campaign</span>
            </Link>
            <button className="btn-outline px-8 py-3 text-lg">
              Learn More
            </button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Set Your Goal</h3>
              <p className="text-gray-600">Create campaigns with specific funding goals and track progress in real-time.</p>
            </div>
            <div className="text-center">
              <div className="bg-base-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-base-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">NFT Rewards</h3>
              <p className="text-gray-600">Every donation mints a unique NFT with dynamic rarity based on contribution patterns.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant Funding</h3>
              <p className="text-gray-600">Receive funds immediately upon donation with transparent, blockchain-verified transactions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Campaigns */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Active Campaigns</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Support ongoing campaigns and receive unique NFTs as proof of your contribution.
            </p>
          </div>

          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading campaigns...</p>
            </div>
          )}

          {isError && (
            <div className="text-center py-12">
              <p className="text-red-600">Failed to load campaigns. Please try again.</p>
            </div>
          )}

          {campaigns.length === 0 && !isLoading && !isError && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No active campaigns yet.</p>
              <Link href="/create" className="btn-primary">
                Be the first to create one!
              </Link>
            </div>
          )}

          {campaigns.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id.toString()} campaign={campaign} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-bold mb-2">GoNFTme</h3>
          <p className="text-gray-400 mb-4">Web3 Crowdfunding with NFT Rewards</p>
          <p className="text-sm text-gray-500">
            Built on Base • Powered by Coinbase • Open Source
          </p>
        </div>
      </footer>
    </div>
  )
} 