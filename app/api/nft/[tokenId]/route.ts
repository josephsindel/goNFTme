import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http } from 'viem'
import { baseSepolia } from 'viem/chains'
import { CONTRACT_ADDRESSES, CAMPAIGN_FACTORY_ABI } from '../../../../lib/web3'

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http()
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  try {
    const { tokenId } = await params

    // Fetch the token URI from the contract
    const tokenURI = await publicClient.readContract({
      address: CONTRACT_ADDRESSES[baseSepolia.id] as `0x${string}`,
      abi: CAMPAIGN_FACTORY_ABI,
      functionName: 'tokenURI',
      args: [BigInt(tokenId)]
    })

    // Parse the JSON metadata
    const metadata = JSON.parse(tokenURI)

    return NextResponse.json(metadata)
  } catch (error) {
    console.error('Error fetching NFT metadata:', error)
    return NextResponse.json(
      { error: 'Failed to fetch NFT metadata' },
      { status: 500 }
    )
  }
}
