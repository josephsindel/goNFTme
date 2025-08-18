# 🚀 GoNFTme - Web3 Crowdfunding with NFT Rewards

[![Live Demo](https://img.shields.io/badge/Live%20Demo-gonftme.com-blue?style=for-the-badge)](https://go-nft-me-git-main-joesindels-projects.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Built on Base](https://img.shields.io/badge/Built%20on-Base-0052ff?style=for-the-badge)](https://base.org)

> **The first zero-fee Web3 crowdfunding platform.** Built by the community, for the community.

## ✨ Features

- 🆓 **Zero Platform Fees** - 100% of donations go directly to creators
- 🎨 **NFT Rewards** - Every donation mints a unique NFT as proof of contribution
- ⚡ **Instant Funding** - Funds transfer immediately via smart contracts
- 🌍 **Global Access** - No geographic restrictions or banking requirements
- 🔒 **Transparent** - All transactions visible on blockchain
- 🛡️ **Secure** - Built with security-first principles and comprehensive testing

## 🎯 Why GoNFTme?

Traditional crowdfunding platforms charge 5-8% fees, have geographic restrictions, and can arbitrarily freeze campaigns. GoNFTme leverages blockchain technology to provide:

- **True Ownership** - Creators maintain full control of their campaigns
- **Transparency** - All transactions are publicly verifiable
- **Global Reach** - Anyone with a crypto wallet can participate
- **Instant Settlement** - No waiting periods for fund transfers
- **Unique Rewards** - NFTs create lasting proof of support

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Wagmi** - React hooks for Ethereum

### Blockchain
- **Base** - Layer 2 Ethereum scaling solution
- **Solidity** - Smart contract development
- **Hardhat** - Development environment
- **OpenZeppelin** - Security-audited contract libraries

### Authentication & Security
- **NextAuth.js** - Secure authentication
- **Zod** - Runtime type validation
- **Security Logging** - Comprehensive audit trails

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask or Coinbase Wallet
- Base Sepolia ETH for testing

### Installation

```bash
# Clone the repository
git clone https://github.com/josephsindel/goNFTme.git
cd goNFTme

# Install dependencies
npm install

# Set up environment variables
npm run setup

# Start development server
npm run dev
```

### Environment Setup

Copy `.env.example` to `.env.local` and configure:

```bash
# Blockchain Configuration
NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS=your_contract_address
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_id

# Authentication (for admin features)
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Deployment (optional)
PRIVATE_KEY=your_testnet_private_key
ALCHEMY_API_KEY=your_alchemy_api_key
```

### Smart Contract Deployment

```bash
# Compile contracts
npm run compile

# Deploy to Base Sepolia testnet
npm run deploy:base-sepolia

# Deploy to Base mainnet (production)
npm run deploy:mainnet
```

## 📖 Documentation

- **[Complete Learning Guide](docs/COMPLETE_LEARNING_GUIDE.md)** - Comprehensive technical documentation
- **[Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** - Production deployment instructions
- **[Security Assessment](docs/OWASP_TOP_10_ASSESSMENT.md)** - Security analysis and compliance

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Security audit
npm run security:audit
```

## 🏗️ Architecture

```
Frontend (Next.js)
├── Smart Contract Interaction (Wagmi)
├── Authentication (NextAuth.js)
├── NFT Generation (Dynamic SVG)
└── IPFS Storage (Demo: localStorage)

Smart Contract (Solidity)
├── Campaign Management
├── Donation Handling
├── NFT Minting (ERC721)
└── Security (OpenZeppelin)
```

## 🤝 Contributing

We welcome contributions from the community! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests
4. **Run the test suite**: `npm test`
5. **Commit your changes**: `git commit -m 'feat: Add amazing feature'`
6. **Push to your branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Code Style

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for formatting
- **Security-first** development practices

## 🔒 Security

GoNFTme takes security seriously:

- ✅ **OWASP Top 10** compliance
- ✅ **Smart contract** security patterns
- ✅ **Input validation** and sanitization
- ✅ **Comprehensive testing** with security focus
- ✅ **Regular audits** with SonarQube

Report security issues to: security@gonftme.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Support the Project

GoNFTme is free and open-source. If you find it valuable:

- ⭐ **Star this repository**
- 🐛 **Report bugs** and suggest features
- 🤝 **Contribute code** or documentation
- 💝 **Donate ETH** to `joesindel.cb.id` to support development

## 🔗 Links

- **Live Demo**: [gonftme.com](https://go-nft-me-git-main-joesindels-projects.vercel.app/)
- **Documentation**: [Complete Learning Guide](docs/COMPLETE_LEARNING_GUIDE.md)
- **Smart Contract**: [BaseScan](https://sepolia.basescan.org/address/0x38d0c38EBED03B12f01D94a5117e039129fC2076)
- **Base Network**: [base.org](https://base.org)

## 🎉 Built With ❤️

Created as a public good for the Web3 community. No fees, no profit-taking, just pure innovation.

---

**Ready to revolutionize crowdfunding?** [Start your campaign today!](https://go-nft-me-git-main-joesindels-projects.vercel.app/create)

---

*Auto-deploy test - Sun Aug 18 15:19:26 PDT 2025*