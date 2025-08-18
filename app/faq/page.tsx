'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, ChevronRight, Shield, Zap, Globe, Heart, Coins, Lock } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  icon: React.ReactNode
}

const faqData: FAQItem[] = [
  {
    question: "How is GoNFTme different from traditional crowdfunding platforms?",
    answer: "GoNFTme operates on blockchain technology, providing complete transparency, instant global access, and permanent proof of contributions through NFTs. Unlike traditional platforms, there are no geographic restrictions, no lengthy approval processes, and no platform fees taken from your campaigns.",
    icon: <Globe className="w-5 h-5 text-blue-500" />
  },
  {
    question: "Does GoNFTme take any fees from campaigns?",
    answer: "Absolutely not! GoNFTme takes zero platform fees. 100% of donations go directly to campaign creators. The only costs are minimal blockchain transaction fees (gas fees) that go to the network validators, not to us. This platform is built to empower creators, not profit from them.",
    icon: <Heart className="w-5 h-5 text-red-500" />
  },
  {
    question: "What are the advantages of blockchain-based crowdfunding?",
    answer: "Blockchain crowdfunding offers unparalleled transparency (all transactions are public), instant global access without banking restrictions, permanent records that can't be altered, automatic execution through smart contracts, and unique NFT rewards that prove your support forever.",
    icon: <Shield className="w-5 h-5 text-green-500" />
  },
  {
    question: "How do NFT rewards work?",
    answer: "Every donation automatically mints a unique NFT as proof of your contribution. These NFTs include the campaign image, your donation amount, and timestamp. They're permanently yours and can be viewed in your wallet or on NFT marketplaces. Creators also receive special NFTs when they launch campaigns.",
    icon: <Coins className="w-5 h-5 text-purple-500" />
  },
  {
    question: "Is my money safe? What about security?",
    answer: "Your funds are protected by blockchain technology and smart contracts. Donations are transferred instantly to creators - there's no central authority holding your money. The smart contract code is open-source and has been security tested. You maintain full control of your wallet at all times.",
    icon: <Lock className="w-5 h-5 text-orange-500" />
  },
  {
    question: "Why should I use this instead of traditional platforms?",
    answer: "Traditional platforms often have high fees (5-8%), geographic restrictions, lengthy approval processes, and can freeze or cancel campaigns arbitrarily. GoNFTme offers instant global access, zero platform fees, transparent operations, unique NFT rewards, and creator-friendly policies without corporate interference.",
    icon: <Zap className="w-5 h-5 text-yellow-500" />
  },
  {
    question: "Do I need to understand blockchain to use GoNFTme?",
    answer: "Not at all! While GoNFTme runs on blockchain, the user experience is designed to be simple and familiar. Just connect your wallet (like MetaMask or Coinbase Wallet), and you can create campaigns or donate just like any other platform. The blockchain benefits happen automatically behind the scenes.",
    icon: <Globe className="w-5 h-5 text-indigo-500" />
  },
  {
    question: "What happens to my campaign data?",
    answer: "Your campaign data is stored on the blockchain, making it permanent and censorship-resistant. Unlike traditional platforms that can delete your campaign or change terms, blockchain storage ensures your campaign remains accessible forever. Images are stored on IPFS (decentralized storage) for maximum reliability.",
    icon: <Shield className="w-5 h-5 text-teal-500" />
  },
  {
    question: "How does the platform sustain itself without fees?",
    answer: "GoNFTme is built as a public good for the Web3 community. The platform is sustained through optional donations from users who appreciate the service. All code is open-source, and the platform operates on principles of decentralization and community support rather than profit extraction.",
    icon: <Heart className="w-5 h-5 text-pink-500" />
  },
  {
    question: "Can campaigns be censored or removed?",
    answer: "Campaigns can only be paused or removed by the platform administrator in extreme cases (illegal content, etc.). Unlike traditional platforms that can arbitrarily change rules or remove campaigns for business reasons, GoNFTme operates with transparent, consistent policies. Campaign data remains permanently on the blockchain for transparency, and any moderation actions are logged and visible.",
    icon: <Lock className="w-5 h-5 text-red-600" />
  }
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link 
            href="/"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 w-fit mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h1>
            <p className="text-gray-600">
              Everything you need to know about GoNFTme and blockchain crowdfunding
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {faq.icon}
                  <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                </div>
                {openItems.includes(index) ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
              </button>
              
              {openItems.includes(index) && (
                <div className="px-6 pb-4">
                  <div className="pl-8 text-gray-700 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Experience Web3 Crowdfunding?</h2>
          <p className="text-blue-100 mb-6">
            Join the future of decentralized fundraising with zero platform fees and instant global access.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Create Campaign
            </Link>
            <Link
              href="/"
              className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Browse Campaigns
            </Link>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Still have questions? This platform is built by the community, for the community.
          </p>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">💡 Did you know?</h3>
            <p className="text-gray-600 text-sm">
              GoNFTme is completely free and open-source. If you find it valuable, consider supporting 
              the developer to help maintain and improve the platform for everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
