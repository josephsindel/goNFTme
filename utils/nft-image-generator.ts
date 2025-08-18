/**
 * NFT Image Generation - Creates dynamic NFT images with campaign backgrounds
 */

// Simple SVG fallback for when images are too large for blockchain storage
function generateSimpleSVGFallback(title: string): string {
  const svg = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#bg)" />
      <text x="200" y="180" text-anchor="middle" font-family="system-ui" font-size="24" font-weight="bold" fill="white" stroke="rgba(0,0,0,0.3)" stroke-width="1">
        GoNFTme
      </text>
      <text x="200" y="220" text-anchor="middle" font-family="system-ui" font-size="16" fill="rgba(255,255,255,0.9)">
        ${title.length > 20 ? title.substring(0, 20) + '...' : title}
      </text>
      <text x="200" y="260" text-anchor="middle" font-family="system-ui" font-size="14" fill="rgba(255,255,255,0.8)">
        NFT Reward
      </text>
    </svg>
  `
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

/**
 * Generate Donor NFT image with campaign image as background
 */
export async function generateDonorNFTImage(
  campaignImageUri: string,
  campaignTitle: string,
  donorAddress: string,
  donationAmount: string,
  donationMessage?: string
): Promise<string> {
  // Create a beautiful but compact SVG that includes the campaign image reference
  const svg = `
    <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="donorBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:0.9"/>
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:0.9"/>
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
        </filter>
      </defs>
      
      <!-- Background with campaign image reference -->
      <rect width="400" height="400" fill="url(#donorBg)"/>
      <image href="${campaignImageUri}" x="0" y="0" width="400" height="400" opacity="0.3"/>
      
      <!-- Overlay for readability -->
      <rect width="400" height="400" fill="rgba(0,0,0,0.2)"/>
      
      <!-- Heart icon -->
      <g transform="translate(200,60)">
        <path d="M0,15 C-15,-5 -30,0 -15,20 C-10,25 0,35 0,35 C0,35 10,25 15,20 C30,0 15,-5 0,15 Z" 
              fill="#FF6B6B" filter="url(#shadow)"/>
      </g>
      
      <!-- Content card -->
      <rect x="50" y="120" width="300" height="${donationMessage ? '180' : '160'}" rx="15" 
            fill="rgba(255,255,255,0.95)" filter="url(#shadow)"/>
      
      <!-- Title -->
      <text x="200" y="150" text-anchor="middle" font-family="system-ui" font-size="20" font-weight="bold" fill="#1F2937">
        💝 GENEROUS DONOR
      </text>
      
      <!-- Donor address -->
      <text x="200" y="175" text-anchor="middle" font-family="system-ui" font-size="14" fill="#6B7280">
        ${donorAddress.slice(0, 8)}...${donorAddress.slice(-6)}
      </text>
      
      <!-- Donation amount -->
      <text x="200" y="200" text-anchor="middle" font-family="system-ui" font-size="16" font-weight="600" fill="#059669">
        Donated ${donationAmount} ETH
      </text>
      
      <!-- Campaign title -->
      <text x="200" y="225" text-anchor="middle" font-family="system-ui" font-size="14" fill="#4B5563">
        to "${campaignTitle.length > 30 ? campaignTitle.slice(0, 30) + '...' : campaignTitle}"
      </text>
      
      ${donationMessage ? `
        <!-- Message -->
        <text x="200" y="250" text-anchor="middle" font-family="system-ui" font-size="12" fill="#6B7280" font-style="italic">
          "${donationMessage.length > 40 ? donationMessage.slice(0, 40) + '...' : donationMessage}"
        </text>
      ` : ''}
      
      <!-- Thank you -->
      <rect x="125" y="${donationMessage ? '270' : '250'}" width="150" height="35" rx="17" fill="#f093fb"/>
      <text x="200" y="${donationMessage ? '292' : '272'}" text-anchor="middle" font-family="system-ui" 
            font-size="14" font-weight="600" fill="white">
        🤝 Thank You!
      </text>
      
      <!-- Branding -->
      <text x="200" y="370" text-anchor="middle" font-family="system-ui" font-size="10" fill="#9CA3AF">
        Powered by GoNFTme
      </text>
    </svg>
  `
  
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

/**
 * Generate Creator NFT image with campaign image as background
 */
export async function generateCreatorNFTImage(
  campaignImageUri: string,
  campaignTitle: string,
  creatorAddress: string,
  goalAmount: string,
  campaignId?: string
): Promise<string> {
  // Create a beautiful but compact SVG for creator NFT
  const svg = `
    <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="creatorBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f093fb;stop-opacity:0.9"/>
          <stop offset="100%" style="stop-color:#f5576c;stop-opacity:0.9"/>
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
        </filter>
      </defs>
      
      <!-- Background with campaign image reference -->
      <rect width="400" height="400" fill="url(#creatorBg)"/>
      <image href="${campaignImageUri}" x="0" y="0" width="400" height="400" opacity="0.3"/>
      
      <!-- Overlay for readability -->
      <rect width="400" height="400" fill="rgba(0,0,0,0.2)"/>
      
      <!-- Crown icon -->
      <g transform="translate(200,60)">
        <path d="M-30,-10 L-20,-25 L-10,-15 L0,-30 L10,-15 L20,-25 L30,-10 L25,15 L-25,15 Z" 
              fill="#FFD700" stroke="#FFA500" stroke-width="2" filter="url(#shadow)"/>
      </g>
      
      <!-- Content card -->
      <rect x="50" y="120" width="300" height="200" rx="15" 
            fill="rgba(255,255,255,0.95)" filter="url(#shadow)"/>
      
      <!-- Title -->
      <text x="200" y="150" text-anchor="middle" font-family="system-ui" font-size="20" font-weight="bold" fill="#1F2937">
        🏆 CAMPAIGN CREATOR
      </text>
      
      <!-- Creator address -->
      <text x="200" y="175" text-anchor="middle" font-family="system-ui" font-size="14" fill="#6B7280">
        ${creatorAddress.slice(0, 8)}...${creatorAddress.slice(-6)}
      </text>
      
      <!-- Goal amount -->
      <text x="200" y="200" text-anchor="middle" font-family="system-ui" font-size="16" font-weight="600" fill="#059669">
        Goal: ${goalAmount} ETH
      </text>
      
      <!-- Campaign title -->
      <text x="200" y="225" text-anchor="middle" font-family="system-ui" font-size="14" fill="#4B5563">
        "${campaignTitle.length > 35 ? campaignTitle.slice(0, 35) + '...' : campaignTitle}"
      </text>
      
      ${campaignId ? `
        <!-- Campaign URL -->
        <text x="200" y="250" text-anchor="middle" font-family="system-ui" font-size="12" fill="#3B82F6">
          goNFTme.com/campaign/${campaignId}
        </text>
        
        <!-- Call to action -->
        <rect x="100" y="270" width="200" height="35" rx="17" fill="#10B981"/>
        <text x="200" y="292" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="600" fill="white">
          🚀 Support This Campaign!
        </text>
      ` : ''}
      
      <!-- Branding -->
      <text x="200" y="370" text-anchor="middle" font-family="system-ui" font-size="10" fill="#9CA3AF">
        Powered by GoNFTme
      </text>
    </svg>
  `
  
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
