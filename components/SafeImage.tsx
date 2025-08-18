'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Target } from 'lucide-react'
import { ipfsToHttp } from '../utils/ipfs'

interface SafeImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  sizes?: string
  fallbackIcon?: React.ReactNode
}

export function SafeImage({ 
  src, 
  alt, 
  width, 
  height, 
  fill, 
  className, 
  sizes, 
  fallbackIcon 
}: Readonly<SafeImageProps>) {
  const [hasError, setHasError] = useState(false)
  
  // Initialize image source immediately to avoid empty string issues
  const getValidSrc = (sourceSrc: string) => {
    if (!sourceSrc || sourceSrc.trim() === '') {
      return '/placeholder-campaign.svg'
    }
    return ipfsToHttp(sourceSrc)
  }
  
  const [imgSrc, setImgSrc] = useState(() => getValidSrc(src))

  // Update image source when src prop changes
  useEffect(() => {
    const newSrc = getValidSrc(src)
    setImgSrc(newSrc)
    setHasError(false) // Reset error state when src changes
  }, [src])

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      
      // For user-upload images that fail, try picsum fallback
      if (src?.startsWith('user-upload-')) {
        const seed = src.slice(-8)
        const fallbackUrl = `https://picsum.photos/400/300?random=${seed}`
        setImgSrc(fallbackUrl)
        return
      }
      
      // For other failures, go to placeholder
      if (!imgSrc.includes('placeholder-campaign.svg')) {
        setImgSrc('/placeholder-campaign.svg')
        return
      }
    }
    
    // If placeholder also fails, we'll show the icon fallback (handled in render)
  }

  // If we've tried everything and still have errors, show icon fallback
  if (hasError && imgSrc === '/placeholder-campaign.svg') {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className || ''}`}>
        {fallbackIcon || <Target className="w-12 h-12 text-gray-400" />}
      </div>
    )
  }

  // Safety check - if imgSrc is still empty/invalid, show icon fallback
  if (!imgSrc || imgSrc.trim() === '') {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className || ''}`}>
        {fallbackIcon || <Target className="w-12 h-12 text-gray-400" />}
      </div>
    )
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      sizes={sizes}
      onError={handleError}
      priority={false}
    />
  )
}
