/**
 * Dynamic NFT generation utilities for Creator and Donor NFTs
 */

export interface NFTMetadata {
  name: string
  description: string
  image: string
  external_url?: string
  attributes: Array<{
    trait_type: string
    value: string
    display_type?: string
  }>
  background_color?: string
  animation_url?: string
}

/**
 * Generate Creator NFT metadata with personalized content
 */
export function generateCreatorNFT(
  campaignTitle: string,
  campaignDescription: string,
  campaignImageUri: string,
  creatorAddress: string,
  campaignId: string,
  goalAmount: string,
  creatorName?: string // ENS or Base ID if available
): NFTMetadata {
  const displayName = creatorName || `${creatorAddress.slice(0, 6)}...${creatorAddress.slice(-4)}`
  const campaignUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://gonftme.app'}/campaign/${campaignId}`
  
  return {
    name: `🏆 Campaign Creator: ${campaignTitle}`,
    description: `🎉 Congratulations ${displayName}! 

Thank you for creating "${campaignTitle}" on GoNFTme! As the visionary behind this campaign, you've taken the first step toward making a difference.

📋 Campaign Details:
• Title: ${campaignTitle}
• Goal: ${goalAmount} ETH
• Creator: ${displayName}

🔗 Support this campaign: ${campaignUrl}

This exclusive Creator NFT represents your leadership and initiative in the Web3 crowdfunding space. Share your campaign and watch your community rally behind your cause!

#GoNFTme #Creator #Web3 #Crowdfunding`,
    
    image: generateSimpleCreatorSVG(campaignTitle, displayName, goalAmount),
    external_url: campaignUrl,
    
    attributes: [
      { trait_type: "Role", value: "Campaign Creator" },
      { trait_type: "Campaign Title", value: campaignTitle },
      { trait_type: "Campaign ID", value: campaignId },
      { trait_type: "Goal Amount", value: `${goalAmount} ETH` },
      { trait_type: "Creator", value: displayName },
      { trait_type: "Creator Address", value: creatorAddress },
      { trait_type: "Platform", value: "GoNFTme" },
      { trait_type: "Network", value: "Base Sepolia" },
      { trait_type: "NFT Type", value: "Creator Badge" },
      { trait_type: "Rarity", value: "Legendary" },
      { trait_type: "Creation Date", value: new Date().toISOString().split('T')[0] }
    ],
    
    background_color: "667eea"
  }
}

/**
 * Generate Donor NFT metadata with personalized content
 */
export function generateDonorNFT(
  campaignTitle: string,
  campaignImageUri: string,
  donorAddress: string,
  donationAmount: string,
  campaignId: string,
  donationMessage?: string,
  donorName?: string
): NFTMetadata {
  const displayName = donorName || `${donorAddress.slice(0, 6)}...${donorAddress.slice(-4)}`
  const campaignUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://gonftme.app'}/campaign/${campaignId}`
  
  return {
    name: `💝 Donation NFT: ${campaignTitle}`,
    description: `🙏 Thank you ${displayName} for your generous donation!

You've contributed ${donationAmount} ETH to "${campaignTitle}" and made a real difference in someone's life.

💰 Your Contribution:
• Amount: ${donationAmount} ETH
• Campaign: ${campaignTitle}
• Donor: ${displayName}
${donationMessage ? `• Message: "${donationMessage}"` : ''}

🔗 Campaign: ${campaignUrl}

This NFT is proof of your generosity and support for meaningful causes. Every donation matters, and your contribution helps dreams become reality.

#GoNFTme #Donor #Web3 #Generosity`,
    
    image: generateSimpleDonorSVG(campaignTitle, displayName, donationAmount),
    external_url: campaignUrl,
    
    attributes: [
      { trait_type: "Role", value: "Generous Donor" },
      { trait_type: "Campaign Title", value: campaignTitle },
      { trait_type: "Campaign ID", value: campaignId },
      { trait_type: "Donation Amount", value: `${donationAmount} ETH`, display_type: "boost_number" },
      { trait_type: "Donor", value: displayName },
      { trait_type: "Donor Address", value: donorAddress },
      { trait_type: "Platform", value: "GoNFTme" },
      { trait_type: "Network", value: "Base Sepolia" },
      { trait_type: "NFT Type", value: "Donation Receipt" },
      { trait_type: "Rarity", value: getRarityByAmount(donationAmount) },
      { trait_type: "Donation Date", value: new Date().toISOString().split('T')[0] },
      ...(donationMessage ? [{ trait_type: "Message", value: donationMessage }] : [])
    ],
    
    background_color: "f093fb"
  }
}

/**
 * Generate Creator NFT image (SVG with campaign background)
 */
function generateCreatorNFTImage(
  campaignTitle: string,
  campaignImageUri: string,
  creatorName: string,
  goalAmount: string
): string {
  // Create a data URL for an SVG that includes the campaign image as background
  const svg = `
    <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="creatorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:0.9"/>
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:0.9"/>
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
        </filter>
      </defs>
      
      <!-- Background overlay -->
      <rect width="400" height="400" fill="url(#creatorGrad)"/>
      
      <!-- Crown icon for creator -->
      <g transform="translate(200,80)">
        <path d="M-30,-10 L-20,-25 L-10,-15 L0,-30 L10,-15 L20,-25 L30,-10 L25,15 L-25,15 Z" 
              fill="#FFD700" stroke="#FFA500" stroke-width="2" filter="url(#shadow)"/>
        <circle cx="-15" cy="-5" r="3" fill="#FF6B6B"/>
        <circle cx="0" cy="-10" r="4" fill="#4ECDC4"/>
        <circle cx="15" cy="-5" r="3" fill="#45B7D1"/>
      </g>
      
      <!-- Creator badge -->
      <rect x="50" y="150" width="300" height="100" rx="15" fill="white" fill-opacity="0.95" filter="url(#shadow)"/>
      
      <!-- Text content -->
      <text x="200" y="180" text-anchor="middle" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="#1F2937">
        🎉 CAMPAIGN CREATOR
      </text>
      <text x="200" y="205" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" fill="#4B5563">
        ${creatorName}
      </text>
      <text x="200" y="225" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="#6B7280">
        Goal: ${goalAmount} ETH
      </text>
      
      <!-- Campaign title (truncated if too long) -->
      <text x="200" y="290" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="#1F2937">
        "${campaignTitle.length > 30 ? campaignTitle.substring(0, 30) + '...' : campaignTitle}"
      </text>
      
      <!-- Call to action -->
      <rect x="100" y="320" width="200" height="40" rx="20" fill="#667eea" filter="url(#shadow)"/>
      <text x="200" y="345" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="white">
        🚀 Share Your Campaign!
      </text>
      
      <!-- GoNFTme branding -->
      <text x="200" y="385" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" fill="#9CA3AF">
        Powered by GoNFTme
      </text>
    </svg>
  `
  
  // Use encodeURIComponent instead of btoa to handle Unicode characters
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

/**
 * Generate Donor NFT image (SVG with campaign background)
 */
function generateDonorNFTImage(
  campaignTitle: string,
  campaignImageUri: string,
  donorName: string,
  donationAmount: string,
  donationMessage?: string
): string {
  const svg = `
    <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="donorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f093fb;stop-opacity:0.9"/>
          <stop offset="100%" style="stop-color:#f5576c;stop-opacity:0.9"/>
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
        </filter>
      </defs>
      
      <!-- Background overlay -->
      <rect width="400" height="400" fill="url(#donorGrad)"/>
      
      <!-- Heart icon for donor -->
      <g transform="translate(200,80)">
        <path d="M0,15 C-15,-5 -30,0 -15,20 C-10,25 0,35 0,35 C0,35 10,25 15,20 C30,0 15,-5 0,15 Z" 
              fill="#FF6B6B" stroke="#E53E3E" stroke-width="2" filter="url(#shadow)"/>
      </g>
      
      <!-- Donor badge -->
      <rect x="50" y="140" width="300" height="120" rx="15" fill="white" fill-opacity="0.95" filter="url(#shadow)"/>
      
      <!-- Text content -->
      <text x="200" y="170" text-anchor="middle" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="#1F2937">
        💝 GENEROUS DONOR
      </text>
      <text x="200" y="195" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" fill="#4B5563">
        ${donorName}
      </text>
      <text x="200" y="215" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#059669">
        Donated ${donationAmount} ETH
      </text>
      <text x="200" y="235" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="#6B7280">
        to "${campaignTitle.length > 25 ? campaignTitle.substring(0, 25) + '...' : campaignTitle}"
      </text>
      
      <!-- Donation message if provided -->
      ${donationMessage ? `
        <text x="200" y="255" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" fill="#4B5563" font-style="italic">
          "${donationMessage.length > 40 ? donationMessage.substring(0, 40) + '...' : donationMessage}"
        </text>
      ` : ''}
      
      <!-- Call to action -->
      <rect x="100" y="290" width="200" height="40" rx="20" fill="#f093fb" filter="url(#shadow)"/>
      <text x="200" y="315" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="white">
        🤝 Thank You!
      </text>
      
      <!-- GoNFTme branding -->
      <text x="200" y="385" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" fill="#9CA3AF">
        Powered by GoNFTme
      </text>
    </svg>
  `
  
  // Use encodeURIComponent instead of btoa to handle Unicode characters
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

/**
 * Determine rarity based on donation amount
 */
function getRarityByAmount(donationAmount: string): string {
  const amount = parseFloat(donationAmount)
  
  if (amount >= 1.0) return "Legendary"
  if (amount >= 0.1) return "Epic"
  if (amount >= 0.01) return "Rare"
  if (amount >= 0.001) return "Uncommon"
  return "Common"
}

/**
 * Resolve ENS or Base ID for an address (placeholder for future implementation)
 */
export async function resolveAddressName(address: string): Promise<string | null> {
  // In a real implementation, this would:
  // 1. Check ENS resolver for .eth domains
  // 2. Check Base ID resolver for .base domains
  // 3. Return the resolved name or null
  
  // For now, return null (use address)
  // TODO: Implement ENS/Base ID resolution
  return null
}

/**
 * Generate campaign URL for sharing
 */
export function generateCampaignUrl(campaignId: string): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/campaign/${campaignId}`
  }
  return `https://gonftme.app/campaign/${campaignId}` // Production URL
}

/**
 * Create enhanced NFT metadata with all the rich information
 */
export function createEnhancedNFTMetadata(
  type: 'creator' | 'donor',
  campaignTitle: string,
  campaignDescription: string,
  campaignImageUri: string,
  userAddress: string,
  campaignId: string,
  goalAmount?: string,
  donationAmount?: string,
  donationMessage?: string,
  userName?: string
): NFTMetadata {
  if (type === 'creator') {
    return generateCreatorNFT(
      campaignTitle,
      campaignDescription,
      campaignImageUri,
      userAddress,
      campaignId,
      goalAmount || '0',
      userName
    )
  } else {
    return generateDonorNFT(
      campaignTitle,
      campaignImageUri,
      userAddress,
      donationAmount || '0',
      campaignId,
      donationMessage,
      userName
    )
  }
}

/**
 * Additional attributes that could be included in NFTs
 */
export const ADDITIONAL_NFT_ATTRIBUTES = {
  creator: [
    "Vision Score", // Based on campaign description quality
    "Goal Ambition", // Based on goal amount
    "Creativity Level", // Based on campaign uniqueness
    "Leadership Tier" // Based on number of campaigns created
  ],
  donor: [
    "Generosity Level", // Based on donation amount
    "Community Support", // Based on number of donations
    "Impact Score", // Based on campaign progress helped
    "Loyalty Tier" // Based on repeat donations
  ]
}

/**
 * Generate simple Creator NFT SVG image
 */
function generateSimpleCreatorSVG(campaignTitle: string, displayName: string, goalAmount: string): string {
  const svg = `
    <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="creatorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:0.9"/>
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:0.9"/>
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
        </filter>
      </defs>
      
      <!-- Background overlay -->
      <rect width="400" height="400" fill="url(#creatorGrad)"/>
      
      <!-- Crown icon for creator -->
      <g transform="translate(200,80)">
        <path d="M-30,-10 L-20,-25 L-10,-15 L0,-30 L10,-15 L20,-25 L30,-10 L25,15 L-25,15 Z" 
              fill="#FFD700" stroke="#FFA500" stroke-width="2" filter="url(#shadow)"/>
        <circle cx="-15" cy="-5" r="3" fill="#FF6B6B"/>
        <circle cx="0" cy="-10" r="4" fill="#4ECDC4"/>
        <circle cx="15" cy="-5" r="3" fill="#45B7D1"/>
      </g>
      
      <!-- Creator badge -->
      <rect x="50" y="150" width="300" height="100" rx="15" fill="white" fill-opacity="0.95" filter="url(#shadow)"/>
      
      <!-- Text content -->
      <text x="200" y="180" text-anchor="middle" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="#1F2937">
        🎉 CAMPAIGN CREATOR
      </text>
      <text x="200" y="205" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" fill="#4B5563">
        ${displayName}
      </text>
      <text x="200" y="225" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="#6B7280">
        Goal: ${goalAmount} ETH
      </text>
      
      <!-- Campaign title (truncated if too long) -->
      <text x="200" y="290" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="#1F2937">
        "${campaignTitle.length > 20 ? campaignTitle.slice(0, 20) + '...' : campaignTitle}"
      </text>
      
      <!-- Call to action -->
      <rect x="100" y="320" width="200" height="40" rx="20" fill="#667eea" filter="url(#shadow)"/>
      <text x="200" y="345" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="white">
        🚀 Share Your Campaign!
      </text>
      
      <!-- GoNFTme branding -->
      <text x="200" y="385" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" fill="#9CA3AF">
        Powered by GoNFTme
      </text>
    </svg>
  `
  
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

/**
 * Generate simple Donor NFT SVG image
 */
export function generateSimpleDonorSVG(campaignTitle: string, displayName: string, donationAmount: string, donationMessage?: string): string {
  const svg = `
    <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="donorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f093fb;stop-opacity:0.9"/>
          <stop offset="100%" style="stop-color:#f5576c;stop-opacity:0.9"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#donorGrad)"/>
      <g transform="translate(200,80)">
        <path d="M0,15 C-15,-5 -30,0 -15,20 C-10,25 0,35 0,35 C0,35 10,25 15,20 C30,0 15,-5 0,15 Z" 
              fill="#FF6B6B" stroke="#E53E3E" stroke-width="2"/>
      </g>
      <rect x="50" y="150" width="300" height="100" rx="15" fill="white" fill-opacity="0.95"/>
      <text x="200" y="180" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="bold" fill="#1F2937">
        💝 GENEROUS DONOR
      </text>
      <text x="200" y="205" text-anchor="middle" font-family="system-ui" font-size="14" fill="#4B5563">
        ${displayName}
      </text>
      <text x="200" y="225" text-anchor="middle" font-family="system-ui" font-size="12" fill="#6B7280">
        Donated: ${donationAmount} ETH
      </text>
      <text x="200" y="290" text-anchor="middle" font-family="system-ui" font-size="16" font-weight="600" fill="#1F2937">
        "${campaignTitle.length > 20 ? campaignTitle.slice(0, 20) + '...' : campaignTitle}"
      </text>
      ${donationMessage ? `
        <text x="200" y="315" text-anchor="middle" font-family="system-ui" font-size="12" fill="#6B7280" font-style="italic">
          "${donationMessage.length > 30 ? donationMessage.slice(0, 30) + '...' : donationMessage}"
        </text>
      ` : ''}
      <text x="200" y="385" text-anchor="middle" font-family="system-ui" font-size="10" fill="#9CA3AF">
        Powered by GoNFTme
      </text>
    </svg>
  `
  
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
