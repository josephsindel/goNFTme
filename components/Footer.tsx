import Link from 'next/link'
import { Heart, Github, Twitter, Shield } from 'lucide-react'
import { DonateToCreator } from './DonateToCreator'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="logo-sparkle mb-4">
              <h3 className="text-2xl logo-text text-white">GoNFTme</h3>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              The first zero-fee Web3 crowdfunding platform. Built by the community, for the community. 
              100% of donations go directly to creators.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
              <Shield className="w-4 h-4" />
              <span>Zero platform fees • Open source • Decentralized</span>
            </div>
            <DonateToCreator variant="button" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600" />
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/my-nfts" className="hover:text-white transition-colors">
                  My NFTs
                </Link>
              </li>
              <li>
                <Link href="/create" className="hover:text-white transition-colors">
                  Create Campaign
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold text-white mb-4">Community</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a 
                  href="https://github.com/josephsindel/goNFTme" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center space-x-2"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://base.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Built on Base
                </a>
              </li>
              <li>
                <span className="text-gray-400">joesindel.cb.id</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              <p>© 2025 GoNFTme. Built with ❤️ for the Web3 community.</p>
              <p className="mt-1">
                <strong>Zero fees taken.</strong> This platform operates as a public good.
              </p>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live on Base</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span>Open Source</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
