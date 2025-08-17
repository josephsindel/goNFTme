export interface Campaign {
  id: bigint
  title: string
  description: string
  imageUri: string
  goalAmount: bigint
  raisedAmount: bigint
  creator: `0x${string}`
  recipient: `0x${string}`
  isActive: boolean
  createdAt: bigint
  totalDonors: bigint
}

export interface Donation {
  campaignId: bigint
  donor: `0x${string}`
  amount: bigint
  timestamp: bigint
  tokenId: bigint
  donorNumber: bigint
}

export interface CreateCampaignForm {
  title: string
  description: string
  goalAmount: string
  creatorWallet: string
  recipientWallet: string
  image: File | null
}

export interface DonationForm {
  amount: string
}

export interface LeaderboardEntry {
  donor: `0x${string}`
  amount: bigint
  timestamp: bigint
} 