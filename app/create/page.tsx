'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESSES, CAMPAIGN_FACTORY_ABI } from '../../lib/web3'
import { base } from 'wagmi/chains'
import { CreateCampaignForm } from '../../types'
import { parseEthAmount } from '../../utils/format'
import { uploadImageToIPFS } from '../../utils/ipfs'
import { campaignSchema, sanitizeString, validateFileUpload } from '../../utils/validation'
import { ConnectWallet } from '../../components/ConnectWallet'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Upload, Wallet, Target, FileText } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function CreateCampaignPage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const [isUploading, setIsUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<CreateCampaignForm>({
    title: '',
    description: '',
    goalAmount: '',
    creatorWallet: address || '',
    recipientWallet: address || '',
    image: null,
  })

  const { 
    writeContract, 
    data: hash,
    isPending: isCreating,
    error: createError 
  } = useWriteContract()

  const { 
    isLoading: isConfirming,
    isSuccess: isConfirmed 
  } = useWaitForTransactionReceipt({
    hash,
  })

  // Update wallet addresses when account changes
  useState(() => {
    if (address) {
      setFormData(prev => ({
        ...prev,
        creatorWallet: address,
        recipientWallet: prev.recipientWallet || address,
      }))
    }
  }, [address])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // Sanitize input based on field type
    let sanitizedValue = value
    if (name === 'title' || name === 'description') {
      sanitizedValue = sanitizeString(value)
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }))
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateFileUpload(file)
    if (!validation.valid) {
      toast.error(validation.error!)
      return
    }

    setFormData(prev => ({ ...prev, image: file }))
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first')
      return
    }

    // Comprehensive validation using Zod schema
    try {
      const validationData = {
        title: formData.title,
        description: formData.description,
        goalAmount: formData.goalAmount,
        recipientWallet: formData.recipientWallet,
        imageUri: formData.image ? 'valid' : undefined
      }
      
      campaignSchema.parse(validationData)
      
      if (!formData.image) {
        toast.error('Please upload a campaign image')
        return
      }
      
      // Additional file validation
      const fileValidation = validateFileUpload(formData.image)
      if (!fileValidation.valid) {
        toast.error(fileValidation.error!)
        return
      }
      
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'errors' in error) {
        const zodError = error as { errors: Array<{ message: string }> }
        if (zodError.errors && zodError.errors.length > 0) {
          toast.error(zodError.errors[0].message)
        } else {
          toast.error('Please check your input and try again')
        }
      } else {
        toast.error('Please check your input and try again')
      }
      return
    }

    try {
      setIsUploading(true)
      toast.loading('Uploading image...', { id: 'upload' })

      // Upload image to IPFS
      const imageUri = await uploadImageToIPFS(formData.image)
      toast.success('Image uploaded successfully', { id: 'upload' })

      // Create campaign on blockchain
      toast.loading('Creating campaign...', { id: 'create' })
      
      const goalInWei = parseEthAmount(formData.goalAmount)

      writeContract({
        address: CONTRACT_ADDRESSES[base.id] as `0x${string}`,
        abi: CAMPAIGN_FACTORY_ABI,
        functionName: 'createCampaign',
        args: [
          formData.title,
          formData.description,
          imageUri,
          goalInWei,
          formData.recipientWallet as `0x${string}`,
        ],
      })

    } catch (error) {
      console.error('Error creating campaign:', error)
      toast.error('Failed to create campaign')
      setIsUploading(false)
    }
  }

  // Handle transaction confirmation
  useState(() => {
    if (isConfirmed) {
      toast.success('Campaign created successfully!', { id: 'create' })
      setIsUploading(false)
      router.push('/')
    }
  }, [isConfirmed, router])

  // Handle transaction errors
  useState(() => {
    if (createError) {
      toast.error('Failed to create campaign')
      setIsUploading(false)
    }
  }, [createError])

  const isProcessing = isCreating || isConfirming || isUploading

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h1>
          <p className="text-gray-600 mb-8">You need to connect your wallet to create a campaign</p>
          <ConnectWallet />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link 
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Your <span className="text-gradient">Campaign</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Launch your crowdfunding campaign and start receiving NFT-backed donations on Base blockchain.
          </p>
        </div>

        <div className="card max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campaign Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Campaign Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Help me pay my mortgage"
                className="input-field"
                required
              />
            </div>

            {/* Campaign Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Tell your story and explain why you need support..."
                rows={4}
                className="input-field resize-none"
                required
              />
            </div>

            {/* Goal Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Target className="w-4 h-4 inline mr-2" />
                Goal Amount (ETH) *
              </label>
              <input
                type="number"
                name="goalAmount"
                value={formData.goalAmount}
                onChange={handleInputChange}
                placeholder="1.0"
                step="0.01"
                min="0"
                className="input-field"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Upload className="w-4 h-4 inline mr-2" />
                Campaign Image *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                {imagePreview ? (
                  <div className="space-y-4">
                    <div className="relative max-h-48 mx-auto">
                      <Image 
                        src={imagePreview} 
                        alt="Preview" 
                        width={400}
                        height={200}
                        className="max-h-48 mx-auto rounded-lg object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null)
                        setFormData(prev => ({ ...prev, image: null }))
                      }}
                      className="btn-secondary text-sm"
                    >
                      Change Image
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mt-4"
                      required
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Wallet Addresses */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Wallet className="w-4 h-4 inline mr-2" />
                  Creator Wallet
                </label>
                <input
                  type="text"
                  name="creatorWallet"
                  value={formData.creatorWallet}
                  onChange={handleInputChange}
                  placeholder="0x..."
                  className="input-field bg-gray-50"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">Your connected wallet</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Wallet className="w-4 h-4 inline mr-2" />
                  Recipient Wallet *
                </label>
                <input
                  type="text"
                  name="recipientWallet"
                  value={formData.recipientWallet}
                  onChange={handleInputChange}
                  placeholder="0x..."
                  className="input-field"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Where funds will be sent</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full btn-primary py-3 text-lg disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>
                      {isUploading ? 'Uploading...' : 
                       isCreating ? 'Creating Campaign...' : 
                       isConfirming ? 'Confirming...' : 'Processing...'}
                    </span>
                  </div>
                ) : (
                  'Create Campaign'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 