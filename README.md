# GoNFTme - Web3 Crowdfunding with NFT Rewards

A decentralized crowdfunding platform built on Base blockchain where donors receive unique NFTs as proof of contribution. The rarity of NFTs is determined by the donation pattern - fewer donors create rarer NFTs.

## 🌟 Features

- **Create Campaigns**: Set funding goals with custom images and descriptions
- **NFT Rewards**: Every donation mints a unique NFT with dynamic rarity
- **Instant Funding**: Receive funds immediately upon donation
- **Progress Tracking**: Real-time campaign progress and leaderboards
- **Base Integration**: Built on Base blockchain for fast, affordable transactions
- **Coinbase Wallet**: Seamless integration with Coinbase Wallet and other Web3 wallets

## 🚀 How It Works

1. **Campaign Creation**: Users create campaigns with funding goals and upload images
2. **Donations**: Contributors donate ETH and automatically receive NFTs
3. **Dynamic Rarity**: NFT rarity depends on donation patterns:
   - 1 donor of $1000 = "1 of 1" (unique)
   - 100 donors of $10 each = "X of 100" (less rare)
4. **Instant Transfers**: Funds go directly to campaign recipients
5. **Goal Completion**: Campaigns close when funding goals are reached

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Blockchain**: Solidity, Hardhat, Base Network
- **Web3**: Wagmi, Viem, Coinbase Wallet SDK
- **Storage**: IPFS (with fallback to data URLs for development)
- **UI**: Lucide React icons, React Hot Toast

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd goNFTme
   ```

2. **Install dependencies**
   ```bash
   make install
   # or
   npm install
   ```

3. **Environment setup**
   ```bash
   cp env.example .env.local
   ```

4. **Configure environment variables**
   Edit `.env.local` with your values:
   ```env
   # Required for wallet connections
   NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   
   # For deployment (keep private!)
   PRIVATE_KEY=your_private_key_for_deployment
   
   # Will be populated after contract deployment
   NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS=
   ```

5. **Compile smart contracts**
   ```bash
   make compile
   ```

## 🚀 Development

### Start development server
```bash
make dev
# or
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Deploy to Base Sepolia (Testnet)
```bash
make deploy-testnet
```

### Deploy to Base Mainnet
```bash
make deploy-mainnet
```

After deployment, update your `.env.local` with the contract address.

## 📋 Available Commands

```bash
make help          # Show all available commands
make install       # Install dependencies
make dev           # Start development server
make build         # Build for production
make compile       # Compile smart contracts
make deploy-testnet # Deploy to Base Sepolia
make deploy-mainnet # Deploy to Base Mainnet
make clean         # Clean build artifacts
```

## 🏗 Project Structure

```
goNFTme/
├── app/                    # Next.js app directory
│   ├── create/            # Campaign creation page
│   ├── campaign/[id]/     # Campaign detail pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── providers.tsx      # Web3 providers
├── components/            # Reusable React components
├── contracts/             # Solidity smart contracts
├── lib/                   # Configuration and utilities
├── scripts/               # Deployment scripts
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
├── hardhat.config.js      # Hardhat configuration
├── Makefile              # Project commands
└── package.json          # Dependencies
```

## 🔧 Smart Contract

The `CampaignFactory` contract handles:
- Campaign creation and management
- NFT minting for donations
- Fund transfers to recipients
- Progress tracking and leaderboards

Key functions:
- `createCampaign()`: Create new campaigns
- `donate()`: Make donations and mint NFTs
- `getCampaign()`: Get campaign details
- `getActiveCampaigns()`: List active campaigns

## 🎨 NFT Metadata

Each donation NFT includes:
- Campaign background image
- Donation amount and date
- Donor number (e.g., "3 of 50")
- Remaining campaign amount
- Rarity indicator
- Link to campaign page

## 🌐 Supported Networks

- **Base Mainnet** (Chain ID: 8453)
- **Base Sepolia Testnet** (Chain ID: 84532)

## 🔐 Security

- Uses OpenZeppelin contracts for security
- ReentrancyGuard for donation protection
- Input validation on all user inputs
- Automatic refunds for excess donations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For questions or support:
- Create an issue on GitHub
- Join our community discussions
- Check the documentation

## 🚀 Roadmap

- [ ] Enhanced IPFS integration with Pinata
- [ ] Campaign categories and search
- [ ] User profiles and reputation
- [ ] Mobile app development
- [ ] Multi-token support (USDC, etc.)
- [ ] Campaign updates and milestones

---

Built with ❤️ on Base blockchain # Auto-deploy test - Mon Aug 18 14:42:05 PDT 2025
