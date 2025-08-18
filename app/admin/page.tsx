'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESSES, CAMPAIGN_FACTORY_ABI } from '../../lib/web3'
import { baseSepolia } from 'wagmi/chains'
import { Campaign } from '../../types'
import { formatEthAmount } from '../../utils/format'
import { ConnectWallet } from '../../components/ConnectWallet'
import Link from 'next/link'
import { ArrowLeft, Pause, LogOut, Shield, Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { AuthCheckingPage } from '../../components/PageStates'
import { validateWalletConnection, handleContractError, showLoadingToast } from '../../utils/wallet'
import { logAdminAction } from '../../utils/security-logger'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return // Still loading
    
    if (!session) {
      router.push('/auth/signin')
      return
    }
  }, [session, status, router])

  // Read all campaigns from contract
  const { data: allCampaigns, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES[baseSepolia.id] as `0x${string}`,
    abi: CAMPAIGN_FACTORY_ABI,
    functionName: 'getActiveCampaigns',
    chainId: baseSepolia.id,
  })

  const { 
    writeContract, 
    data: hash,
    isPending: isPausing,
  } = useWriteContract()

  const { 
    isLoading: isConfirming,
    isSuccess: isConfirmed 
  } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (allCampaigns) {
      setCampaigns(allCampaigns as Campaign[])
    }
  }, [allCampaigns])

  useEffect(() => {
    if (isConfirmed) {
      toast.success('Campaign updated successfully!')
      // Refresh the page to get updated data
      window.location.reload()
    }
  }, [isConfirmed])

  const handlePauseCampaign = async (campaignId: bigint) => {
    if (!validateWalletConnection(isConnected, address)) return

    // Log admin action
    logAdminAction('pause_campaign', `campaign_${campaignId}`, {
      campaignId: campaignId.toString(),
      adminWallet: address
    })

    try {
      showLoadingToast('Pausing campaign...', 'pause')
      
      writeContract({
        address: CONTRACT_ADDRESSES[baseSepolia.id] as `0x${string}`,
        abi: CAMPAIGN_FACTORY_ABI,
        functionName: 'pauseCampaign',
        args: [campaignId],
      })

    } catch (error) {
      handleContractError(error, 'Pause campaign')
    }
  }

  const handleDeleteCampaign = async (campaignId: bigint) => {
    if (!validateWalletConnection(isConnected, address)) return

    // Confirm deletion
    if (!window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      return
    }

    // Log admin action (high severity for destructive action)
    logAdminAction('delete_campaign', `campaign_${campaignId}`, {
      campaignId: campaignId.toString(),
      adminWallet: address,
      confirmed: true
    })

    try {
      showLoadingToast('Deleting campaign...', 'delete')
      
      writeContract({
        address: CONTRACT_ADDRESSES[baseSepolia.id] as `0x${string}`,
        abi: CAMPAIGN_FACTORY_ABI,
        functionName: 'deleteCampaign',
        args: [campaignId],
      })

    } catch (error) {
      handleContractError(error, 'Delete campaign')
    }
  }

  // Show loading while checking authentication
  if (status === 'loading') {
    return <AuthCheckingPage />
  }

  // Redirect if not authenticated (this should not render due to useEffect, but just in case)
  if (!session) {
    return null
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link 
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 w-16 h-16 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Panel</h1>
            <p className="text-gray-600 mb-2">Welcome, {session.user?.name}!</p>
            <p className="text-gray-600 mb-8">You need to connect your wallet to access admin features</p>
            <ConnectWallet />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {session.user?.name}</span>
              <Link
                href="/admin/security"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <Shield className="w-4 h-4" />
                <span>Security</span>
              </Link>
              <ConnectWallet />
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign Management</h2>
          <p className="text-gray-600">Manage and moderate campaigns on the platform</p>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading campaigns...</p>
          </div>
        )}

        {campaigns.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-600">No campaigns found.</p>
          </div>
        )}

        {campaigns.length > 0 && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <li key={campaign.id.toString()} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                            <span className="text-primary-600 font-semibold text-sm">
                              #{campaign.id.toString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {campaign.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span>Goal: {formatEthAmount(campaign.goalAmount)} ETH</span>
                            <span>Raised: {formatEthAmount(campaign.raisedAmount)} ETH</span>
                            <span>Donors: {campaign.totalDonors.toString()}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              campaign.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {campaign.isActive ? 'Active' : 'Paused'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {campaign.isActive ? (
                        <>
                          <button
                            onClick={() => handlePauseCampaign(campaign.id)}
                            disabled={isPausing || isConfirming}
                            className="inline-flex items-center px-3 py-2 border border-yellow-300 shadow-sm text-sm leading-4 font-medium rounded-md text-yellow-700 bg-white hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
                          >
                            <Pause className="w-4 h-4 mr-1" />
                            {isPausing || isConfirming ? 'Pausing...' : 'Pause'}
                          </button>
                          <button
                            onClick={() => handleDeleteCampaign(campaign.id)}
                            disabled={isPausing || isConfirming}
                            className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            {isPausing || isConfirming ? 'Deleting...' : 'Delete'}
                          </button>
                        </>
                      ) : (
                        <span className="inline-flex items-center px-3 py-2 text-sm text-gray-500">
                          <Pause className="w-4 h-4 mr-1" />
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
