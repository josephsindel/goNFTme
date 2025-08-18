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

    // Fetch the donation details from the contract
    const donation = await publicClient.readContract({
      address: CONTRACT_ADDRESSES[baseSepolia.id] as `0x${string}`,
      abi: CAMPAIGN_FACTORY_ABI,
      functionName: 'getDonation',
      args: [BigInt(tokenId)]
    }) as {
      campaignId: bigint
      donor: string
      amount: bigint
      timestamp: bigint
      tokenId: bigint
      donorNumber: bigint
    }

    // Convert BigInt values to strings for JSON serialization
    const donationData = {
      campaignId: donation.campaignId.toString(),
      donor: donation.donor,
      amount: donation.amount.toString(),
      timestamp: donation.timestamp.toString(),
      tokenId: donation.tokenId.toString(),
      donorNumber: donation.donorNumber.toString()
    }

    return NextResponse.json(donationData)
  } catch (error) {
    console.error('Error fetching donation details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch donation details' },
      { status: 500 }
    )
  }
}
