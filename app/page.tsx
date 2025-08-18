'use client'

import { useState, useEffect } from 'react'
import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESSES, CAMPAIGN_FACTORY_ABI } from '../lib/web3'
import { baseSepolia } from 'wagmi/chains'
import { Campaign } from '../types'
// Utility imports will be used when campaigns are loaded
import Link from 'next/link'
import { Plus, Target, Users, Calendar, Award } from 'lucide-react'
import { ConnectWallet } from '../components/ConnectWallet'
import { CampaignCard } from '../components/CampaignCard'
import { DonateToCreator } from '../components/DonateToCreator'
import { Footer } from '../components/Footer'

export default function HomePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])

  // Read all campaigns from contract (active and completed)
  const { data: activeCampaigns, isError, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESSES[baseSepolia.id] as `0x${string}`,
    abi: CAMPAIGN_FACTORY_ABI,
    functionName: 'getActiveCampaigns',
    chainId: baseSepolia.id,
  })

  // For now, we'll show all campaigns from getActiveCampaigns
  // In the future, we could add a getAllCampaigns function to show completed ones too

  useEffect(() => {
    if (activeCampaigns) {
      setCampaigns(activeCampaigns as Campaign[])
    }
  }, [activeCampaigns])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="logo-sparkle">
                <h1 className="text-2xl logo-text">GoNFTme</h1>
              </div>
              <span className="ml-3 text-sm text-gray-500 hidden sm:inline">Web3 Crowdfunding</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link 
                href="/faq"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium transition-colors hidden sm:inline"
              >
                FAQ
              </Link>
              <Link 
                href="/my-nfts"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm font-medium"
              >
                <Award className="w-4 h-4" />
                <span className="hidden sm:inline">My NFTs</span>
              </Link>
              <Link 
                href="/create"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Campaign</span>
                <span className="sm:hidden">Create</span>
              </Link>
              <ConnectWallet />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Crowdfunding with{' '}
            <span className="logo-text">NFT Rewards</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Create campaigns, receive donations, and mint unique NFTs for every contributor. 
            Built on Base blockchain for fast, secure, and affordable transactions.
          </p>
          
          <div className="flex justify-center items-center mb-12">
            <Link 
              href="/create"
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 sm:px-8 py-3 text-lg font-medium rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>Start Your Campaign</span>
            </Link>
          </div>

          {/* Features */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16">
            <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20  transition-all duration-200">
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Target className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Set Your Goal</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Create campaigns with specific funding goals and track progress in real-time.</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20  transition-all duration-200">
              <div className="bg-gradient-to-br from-base-100 to-base-200 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Users className="w-8 h-8 text-base-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">NFT Rewards</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Every donation mints a unique NFT with dynamic rarity based on contribution patterns.</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20  transition-all duration-200 sm:col-span-2 lg:col-span-1">
              <div className="bg-gradient-to-br from-green-100 to-emerald-200 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Instant Funding</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Receive funds immediately upon donation with transparent, blockchain-verified transactions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Support Banner */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <DonateToCreator variant="banner" />
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
              <p className="mt-2 text-sm text-gray-500">Contract: {CONTRACT_ADDRESSES[baseSepolia.id]}</p>
              <p className="mt-1 text-sm text-gray-500">Network: Base Sepolia (Chain ID: {baseSepolia.id})</p>
            </div>
          )}

          {isError && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-2">Error loading campaigns</p>
              <p className="text-sm text-gray-500 mb-4">{error?.message || 'Contract call failed'}</p>
              <p className="text-gray-600 mb-4">This might be a network connectivity issue.</p>
              <Link href="/create" className="btn-primary">
                Create the first campaign!
              </Link>
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

      <Footer />
    </div>
  )
} 