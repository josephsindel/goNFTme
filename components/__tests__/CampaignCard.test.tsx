import React from 'react'
import { render, screen } from '@testing-library/react'
import { CampaignCard } from '../CampaignCard'
import { Campaign } from '../../types'

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) {
    return <img src={src} alt={alt} {...props} />
  }
})

// Mock utils
jest.mock('../../utils/format', () => ({
  formatEthAmount: jest.fn((amount: bigint) => `${Number(amount) / 1e18}`),
  formatProgress: jest.fn((raised: bigint, goal: bigint) => Math.round((Number(raised) / Number(goal)) * 100)),
  formatAddress: jest.fn((address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`),
  formatDate: jest.fn(() => 'Jan 1, 2024')
}))

jest.mock('../../utils/ipfs', () => ({
  ipfsToHttp: jest.fn((uri: string) => `https://ipfs.io/ipfs/${uri}`)
}))

describe('CampaignCard', () => {
  const mockCampaign: Campaign = {
    id: BigInt(1),
    title: 'Help me pay my mortgage',
    description: 'I need help with my mortgage payments',
    imageUri: 'QmTest123',
    goalAmount: BigInt('1000000000000000000'), // 1 ETH in wei
    raisedAmount: BigInt('250000000000000000'), // 0.25 ETH in wei
    creator: '0x1234567890123456789012345678901234567890' as `0x${string}`,
    recipient: '0x1234567890123456789012345678901234567890' as `0x${string}`,
    isActive: true,
    createdAt: BigInt(1640995200), // Jan 1, 2022
    totalDonors: BigInt(5)
  }

  it('renders campaign information correctly', () => {
    render(<CampaignCard campaign={mockCampaign} />)
    
    expect(screen.getByText('Help me pay my mortgage')).toBeInTheDocument()
    expect(screen.getByText('I need help with my mortgage payments')).toBeInTheDocument()
  })

  it('displays progress information', () => {
    render(<CampaignCard campaign={mockCampaign} />)
    
    expect(screen.getByText('25% funded')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('donors')).toBeInTheDocument()
  })

  it('shows campaign image with correct alt text', () => {
    render(<CampaignCard campaign={mockCampaign} />)
    
    const image = screen.getByAltText('Help me pay my mortgage')
    expect(image).toBeInTheDocument()
    // SafeImage calls ipfsToHttp internally to convert the raw imageUri
    expect(image).toHaveAttribute('src', 'https://ipfs.io/ipfs/QmTest123')
  })

  it('links to campaign detail page', () => {
    render(<CampaignCard campaign={mockCampaign} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/campaign/1')
  })

  it('displays creator address', () => {
    render(<CampaignCard campaign={mockCampaign} />)
    
    expect(screen.getByText('0x1234...7890')).toBeInTheDocument()
    expect(screen.getByText('Created by')).toBeInTheDocument()
  })

  it('shows fallback icon when no image', () => {
    const campaignWithoutImage = { ...mockCampaign, imageUri: '' }
    render(<CampaignCard campaign={campaignWithoutImage} />)
    
    // Should show the Target icon as fallback
    const targetIcon = screen.getByRole('link').querySelector('.lucide-target')
    expect(targetIcon).toBeInTheDocument()
  })

  it('displays funding progress correctly', () => {
    render(<CampaignCard campaign={mockCampaign} />)
    
    expect(screen.getByText('25%')).toBeInTheDocument()
    expect(screen.getByText('funded')).toBeInTheDocument()
  })
})
