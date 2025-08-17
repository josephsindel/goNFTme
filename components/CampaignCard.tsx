'use client'

import { Campaign } from '../types'
import { formatEthAmount, formatProgress, formatAddress, formatDate } from '../utils/format'
import { ipfsToHttp } from '../utils/ipfs'
import Link from 'next/link'
import Image from 'next/image'
import { Users, Target, Calendar } from 'lucide-react'

interface CampaignCardProps {
  campaign: Campaign
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const progress = formatProgress(campaign.raisedAmount, campaign.goalAmount)
  const imageUrl = ipfsToHttp(campaign.imageUri)

  return (
    <Link href={`/campaign/${campaign.id}`}>
      <div className="card hover:shadow-glow transition-all duration-300 cursor-pointer h-full">
        {/* Campaign Image */}
        <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
          {campaign.imageUri ? (
            <Image 
              src={imageUrl}
              alt={campaign.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => {
                // Fallback handled by Next.js Image component
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Target className="w-12 h-12" />
            </div>
          )}
          
          {/* Progress Badge */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
            {progress}% funded
          </div>
        </div>

        {/* Campaign Info */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {campaign.title}
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-2">
            {campaign.description}
          </p>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-900">
                {formatEthAmount(campaign.raisedAmount)} ETH
              </span>
              <span className="text-gray-600">
                of {formatEthAmount(campaign.goalAmount)} ETH
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center pt-3 border-t border-gray-100">
            <div>
              <div className="flex items-center justify-center mb-1">
                <Users className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-sm font-medium text-gray-900">
                {campaign.totalDonors.toString()}
              </div>
              <div className="text-xs text-gray-500">donors</div>
            </div>
            
            <div>
              <div className="flex items-center justify-center mb-1">
                <Target className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-sm font-medium text-gray-900">
                {progress}%
              </div>
              <div className="text-xs text-gray-500">funded</div>
            </div>
            
            <div>
              <div className="flex items-center justify-center mb-1">
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-sm font-medium text-gray-900">
                {formatDate(campaign.createdAt).split(',')[0]}
              </div>
              <div className="text-xs text-gray-500">created</div>
            </div>
          </div>

          {/* Creator */}
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Created by</span>
              <span className="font-medium">{formatAddress(campaign.creator)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
} 