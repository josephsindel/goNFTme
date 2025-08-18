/**
 * Upload image to IPFS (simplified version for testing)
 * Returns the actual uploaded image as a data URL for testing
 */
export async function uploadImageToIPFS(file: File): Promise<string> {
  // For testing, convert the actual uploaded file to a data URL
  // In production, this would upload to IPFS and return the hash
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = () => {
      try {
        const dataUrl = reader.result as string
        // For blockchain storage, we'll use a shorter identifier
        // but the actual image will be stored in the frontend
        const timestamp = Date.now()
        const fileId = `user-upload-${timestamp}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`
        
        // Clear old images to prevent quota issues
        const keys = Object.keys(localStorage)
        const imageKeys = keys.filter(key => key.startsWith('image-user-upload-'))
        
        // Keep only the 3 most recent images
        if (imageKeys.length >= 3) {
          const sortedKeys = imageKeys.toSorted((a, b) => a.localeCompare(b))
          sortedKeys.slice(0, sortedKeys.length - 2).forEach(key => {
            localStorage.removeItem(key)
          })
        }
        
        // Store the actual image data in localStorage for demo purposes
        localStorage.setItem(`image-${fileId}`, dataUrl)
        
        // Return the identifier that can be stored on blockchain
        resolve(fileId)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          reject(new Error('Image too large for browser storage. Please try a smaller image (under 1MB recommended).'))
        } else {
          reject(new Error('Failed to store image: ' + (error instanceof Error ? error.message : 'Unknown error')))
        }
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    
    reader.readAsDataURL(file)
  })
}

/**
 * Get stored image from localStorage (for demo purposes)
 */
export function getStoredImage(imageId: string): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(`image-${imageId}`)
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
export function ipfsToHttp(imageId: string): string {
  if (!imageId) return '/placeholder-campaign.svg'
  
  // Check if this is a stored image ID (from our upload system)
  if (imageId.startsWith('user-upload-')) {
    const storedImage = getStoredImage(imageId)
    if (storedImage) {
      return storedImage
    }
    // If not found locally (e.g., accessing from different device), 
    // fall back to a deterministic placeholder based on the image ID
    const seed = imageId.slice(-8) // Use last 8 chars as seed
    return `https://picsum.photos/400/300?random=${seed}`
  }
  
  if (imageId.startsWith('data:')) {
    return imageId // Already a data URL
  }
  
  if (imageId.startsWith('ipfs://')) {
    return imageId.replace('ipfs://', 'https://ipfs.io/ipfs/')
  }
  
  if (imageId.startsWith('Qm') || imageId.startsWith('baf')) {
    return `https://ipfs.io/ipfs/${imageId}`
  }
  
  return imageId
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