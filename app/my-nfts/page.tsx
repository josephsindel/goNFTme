'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { CONTRACT_ADDRESSES, CAMPAIGN_FACTORY_ABI } from '../../lib/web3'
import { baseSepolia } from 'wagmi/chains'
import { ConnectWallet } from '../../components/ConnectWallet'
import { NetworkSwitcher } from '../../components/NetworkSwitcher'
import Link from 'next/link'
import { SafeImage } from '../../components/SafeImage'
import { ArrowLeft, Award, Target, Gift } from 'lucide-react'
import { ipfsToHttp } from '../../utils/ipfs'
// Simplified approach - no complex image generation

interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string
  }>
}

export default function MyNFTsPage() {
  const { address, isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)
  const [nftMetadata, setNftMetadata] = useState<Record<string, NFTMetadata>>({})

  // Get user's NFT balance
  const { data: balance, isLoading: balanceLoading } = useReadContract({
    address: CONTRACT_ADDRESSES[baseSepolia.id] as `0x${string}`,
    abi: [
      {
        inputs: [{ name: 'owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
      }
    ],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: baseSepolia.id,
  })

  // Get user's NFT token IDs
  const { data: userNFTs, isLoading: nftsLoading } = useReadContract({
    address: CONTRACT_ADDRESSES[baseSepolia.id] as `0x${string}`,
    abi: CAMPAIGN_FACTORY_ABI,
    functionName: 'getUserNFTs',
    args: address ? [address] : undefined,
    chainId: baseSepolia.id,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch campaigns to get campaign data for NFT generation
  const { data: campaigns } = useReadContract({
    address: CONTRACT_ADDRESSES[baseSepolia.id] as `0x${string}`,
    abi: CAMPAIGN_FACTORY_ABI,
    functionName: 'getActiveCampaigns',
    chainId: baseSepolia.id,
  })

  // Generate real NFT images using campaign data
  useEffect(() => {
    if (userNFTs && userNFTs.length > 0 && campaigns) {
      userNFTs.forEach(async (tokenId: bigint) => {
        try {
          // Fetch the actual NFT metadata from the contract
          const response = await fetch(`/api/nft/${tokenId}`)
          if (response.ok) {
            const contractMetadata = await response.json()
            
            // Find the associated campaign
            const campaign = campaigns.find((c: { id: bigint }) => c.id.toString() === tokenId.toString())
            
            if (contractMetadata.role === 'creator' && campaign) {
              // Create beautiful SVG with overlay - WORKING VERSION - DON'T CHANGE!
              const dynamicImage = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'><image href='${ipfsToHttp(campaign.imageUri)}' width='400' height='400'/><rect y='320' width='400' height='80' fill='rgba(0,0,0,.8)'/><text x='200' y='350' text-anchor='middle' fill='white' font-size='16'>🏆 CREATOR</text><text x='200' y='370' text-anchor='middle' fill='white' font-size='12'>Goal: ${(Number(campaign.goalAmount) / 1e18).toFixed(4)} ETH</text></svg>`
              
              // Create the final metadata with the generated image
              const finalMetadata: NFTMetadata = {
                name: `🏆 Campaign Creator: ${campaign.title}`,
                description: `🎉 Congratulations! You created "${campaign.title}" on GoNFTme! with a goal of ${Number(campaign.goalAmount) / 1e18} ETH 🎉`,
                image: dynamicImage,
                attributes: [
                  { trait_type: 'Role', value: 'Campaign Creator' },
                  { trait_type: 'Campaign Title', value: campaign.title },
                  { trait_type: 'Token ID', value: tokenId.toString() },
                  { trait_type: 'Goal Amount', value: `${Number(campaign.goalAmount) / 1e18} ETH` },
                  { trait_type: 'NFT Type', value: 'Creator Badge' },
                  { trait_type: 'Rarity', value: 'Legendary' }
                ]
              }
              
              setNftMetadata(prev => ({
                ...prev,
                [tokenId.toString()]: finalMetadata
              }))
            } else {
              // For donor NFTs, use the metadata from the contract (which includes dynamic image)
              const finalMetadata: NFTMetadata = {
                name: contractMetadata.name || `💝 Donor NFT #${tokenId.toString()}`,
                description: contractMetadata.description || `🙏 Thank you for your generous donation!`,
                image: contractMetadata.image ? ipfsToHttp(contractMetadata.image) : '/placeholder-campaign.svg',
                attributes: contractMetadata.attributes || [
                  { trait_type: 'Role', value: 'Generous Donor' },
                  { trait_type: 'Token ID', value: tokenId.toString() },
                  { trait_type: 'Platform', value: 'GoNFTme' }
                ]
              }
              
              setNftMetadata(prev => ({
                ...prev,
                [tokenId.toString()]: finalMetadata
              }))
            }
          }
        } catch (error) {
          console.error('Error processing NFT:', error)
          // Fallback to basic metadata
          const fallbackMetadata: NFTMetadata = {
            name: `GoNFTme NFT #${tokenId.toString()}`,
            description: 'NFT from GoNFTme platform',
            image: '/placeholder-campaign.svg',
            attributes: [
              { trait_type: 'Token ID', value: tokenId.toString() },
              { trait_type: 'Platform', value: 'GoNFTme' }
            ]
          }
          
          setNftMetadata(prev => ({
            ...prev,
            [tokenId.toString()]: fallbackMetadata
          }))
        }
      })
    }
  }, [userNFTs, campaigns, address])

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-lg font-semibold text-gray-900 flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-500" />
              My NFT Collection
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NetworkSwitcher />
        
        {!isConnected ? (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-8">Connect your wallet to view your NFT collection</p>
            <ConnectWallet />
          </div>
        ) : (
          <>
            {balanceLoading || nftsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your NFT collection...</p>
              </div>
            ) : !userNFTs || userNFTs.length === 0 ? (
          <div className="text-center py-12">
            <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No NFTs Yet</h2>
            <p className="text-gray-600 mb-8">
              You haven&apos;t earned any NFTs yet. Create a campaign or make a donation to earn your first NFT!
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/create" className="btn-primary">
                Create Campaign
              </Link>
              <Link href="/" className="btn-secondary">
                Browse Campaigns
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your NFT Collection</h2>
              <p className="text-gray-600">
                You own <strong>{balance?.toString() || '0'}</strong> GoNFTme NFTs
              </p>
            </div>

            {/* NFT Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userNFTs.map((tokenId: bigint) => {
                const metadata = nftMetadata[tokenId.toString()]
                return (
                  <div key={tokenId.toString()} className="card hover:shadow-lg transition-shadow">
                    {/* NFT Image */}
                    <div className="relative h-64 mb-4 rounded-lg overflow-hidden bg-gray-100">
                      {metadata?.image ? (
                        <SafeImage 
                          src={metadata.image}
                          alt={metadata.name || `NFT #${tokenId.toString()}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          fallbackIcon={<Award className="w-16 h-16 text-gray-400" />}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Award className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* NFT Info */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {metadata?.name || `NFT #${tokenId.toString()}`}
                      </h3>
                      
                      <p className="text-sm text-gray-600">
                        {metadata?.description || 'GoNFTme reward NFT'}
                      </p>

                      {/* Attributes */}
                      {metadata?.attributes && (
                        <div className="space-y-2">
                          {metadata.attributes.map((attr, index) => (
                            <div key={`${attr.trait_type}-${index}`} className="flex justify-between text-xs">
                              <span className="text-gray-500">{attr.trait_type}:</span>
                              <span className="text-gray-900 font-medium">{attr.value}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Token ID */}
                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Token ID: #{tokenId.toString()}</span>
                          <span>Base Sepolia</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Contract Info */}
            <div className="mt-12 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Contract Information
              </h3>
              <p className="text-blue-800 mb-4">
                To view these NFTs in your wallet, add this contract address:
              </p>
              <div className="bg-white p-3 rounded border font-mono text-sm break-all">
                {CONTRACT_ADDRESSES[baseSepolia.id]}
              </div>
              <p className="text-blue-700 text-sm mt-2">
                Network: Base Sepolia Testnet (Chain ID: 84532)
              </p>
            </div>
          </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
