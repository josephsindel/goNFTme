/**
 * Upload image to IPFS (simplified version - in production use Pinata or similar)
 * For now, we'll create a placeholder that returns a data URL
 */
export async function uploadImageToIPFS(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      resolve(reader.result as string)
    }
    reader.readAsDataURL(file)
  })
}

/**
 * Generate NFT metadata
 */
export function generateNFTMetadata(
  campaignTitle: string,
  donationAmount: string,
  donorNumber: number,
  totalDonors: number,
  campaignImage: string,
  donationDate: string,
  remainingAmount: string
) {
  return {
    name: `${campaignTitle} - Donation #${donorNumber}`,
    description: `Thank you for supporting "${campaignTitle}"! You are donor ${donorNumber} of ${totalDonors}.`,
    image: campaignImage,
    attributes: [
      {
        trait_type: "Campaign",
        value: campaignTitle
      },
      {
        trait_type: "Donation Amount (ETH)",
        value: donationAmount
      },
      {
        trait_type: "Donor Number",
        value: donorNumber
      },
      {
        trait_type: "Total Donors",
        value: totalDonors
      },
      {
        trait_type: "Donation Date",
        value: donationDate
      },
      {
        trait_type: "Remaining Amount (ETH)",
        value: remainingAmount
      },
      {
        trait_type: "Rarity",
        value: totalDonors === 1 ? "1 of 1 - Unique" : `${donorNumber} of ${totalDonors}`
      }
    ],
    external_url: `https://gonftme.com/campaign/${campaignTitle}`,
  }
}

/**
 * Upload metadata to IPFS
 * For now, returns a data URL with the JSON metadata
 */
export async function uploadMetadataToIPFS(metadata: any): Promise<string> {
  const jsonString = JSON.stringify(metadata, null, 2)
  const dataUrl = `data:application/json;base64,${btoa(jsonString)}`
  return dataUrl
}

/**
 * Convert IPFS hash to HTTP URL
 */
export function ipfsToHttp(ipfsHash: string): string {
  if (ipfsHash.startsWith('data:')) {
    return ipfsHash // Already a data URL
  }
  
  if (ipfsHash.startsWith('ipfs://')) {
    return ipfsHash.replace('ipfs://', 'https://ipfs.io/ipfs/')
  }
  
  if (ipfsHash.startsWith('Qm') || ipfsHash.startsWith('baf')) {
    return `https://ipfs.io/ipfs/${ipfsHash}`
  }
  
  return ipfsHash
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)' }
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Image file size must be less than 5MB' }
  }
  
  return { valid: true }
} 