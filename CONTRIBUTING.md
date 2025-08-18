# Contributing to GoNFTme

Thank you for your interest in contributing to GoNFTme! 🎉

## 🌟 Ways to Contribute

- 🐛 **Report bugs** and suggest improvements
- 📝 **Improve documentation** and guides
- 🔧 **Submit code** improvements and new features
- 🧪 **Add tests** to improve coverage
- 🎨 **Enhance UI/UX** design
- 🔒 **Security audits** and improvements

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Git
- MetaMask or Coinbase Wallet
- Base Sepolia ETH for testing

### Setup Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/goNFTme.git
   cd goNFTme
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up environment**:
   ```bash
   npm run setup
   ```
5. **Start development server**:
   ```bash
   npm run dev
   ```

## 📋 Development Workflow

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes
- Follow existing code style and patterns
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes
```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run linting
npm run lint

# Type checking
npm run type-check
```

### 4. Commit Your Changes
```bash
git add .
git commit -m "feat: Add your amazing feature"
```

Use conventional commit messages:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `test:` - Adding tests
- `refactor:` - Code refactoring
- `security:` - Security improvements

### 5. Push and Create PR
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 🏗️ Project Structure

```
goNFTme/
├── app/                    # Next.js pages and API routes
├── components/             # Reusable React components
├── contracts/              # Solidity smart contracts
├── lib/                    # Core configurations
├── utils/                  # Utility functions
├── types/                  # TypeScript definitions
├── docs/                   # Documentation
└── scripts/                # Deployment and utility scripts
```

## 🎯 Areas We Need Help

### High Priority
- 🔗 **IPFS Integration** - Replace localStorage with real IPFS
- 📱 **Mobile Optimization** - Improve mobile user experience
- 🎨 **Enhanced NFT Generation** - More beautiful NFT designs
- 🔍 **Search & Filtering** - Campaign discovery features

### Medium Priority
- 🏷️ **Campaign Categories** - Organize campaigns by type
- 💬 **Social Features** - Comments, likes, sharing
- 📊 **Analytics Dashboard** - Campaign performance metrics
- 🔔 **Notifications** - Email/push notifications

### Nice to Have
- 🌐 **Internationalization** - Multi-language support
- 📱 **Mobile App** - React Native version
- 🤖 **Telegram Bot** - Campaign notifications
- 🎮 **Gamification** - Badges, achievements

## 🧪 Testing Guidelines

### Unit Tests
- Write tests for all utility functions
- Test React components with @testing-library
- Aim for >80% code coverage

### E2E Tests
- Test complete user flows
- Use Playwright for browser automation
- Test wallet connections and transactions

### Security Tests
- Validate all user inputs
- Test authentication flows
- Check for common vulnerabilities

## 🔒 Security Guidelines

- **Never commit secrets** - Use environment variables
- **Validate all inputs** - Use Zod schemas
- **Sanitize user data** - Prevent XSS attacks
- **Follow OWASP Top 10** - Security best practices
- **Test smart contracts** - Comprehensive testing

## 📝 Code Style

### TypeScript
- Use strict TypeScript configuration
- Define proper interfaces and types
- Avoid `any` types

### React
- Use functional components with hooks
- Follow React best practices
- Implement proper error boundaries

### Smart Contracts
- Follow OpenZeppelin patterns
- Use security modifiers (ReentrancyGuard, etc.)
- Comprehensive testing with Hardhat

## 🐛 Bug Reports

When reporting bugs, please include:
- **Environment** (browser, wallet, network)
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Console errors** if any

## 💡 Feature Requests

For new features, please:
- **Check existing issues** to avoid duplicates
- **Describe the problem** you're trying to solve
- **Propose a solution** with implementation details
- **Consider backward compatibility**

## 🎉 Recognition

Contributors will be:
- 🏆 **Listed in our README** as contributors
- 🎖️ **Recognized in release notes**
- 💝 **Eligible for contributor NFTs** (coming soon!)
- 🌟 **Featured on our website** (when live)

## 📞 Getting Help

- 💬 **GitHub Discussions** - For questions and ideas
- 🐛 **GitHub Issues** - For bugs and feature requests
- 📧 **Email** - security@gonftme.com for security issues

## 📄 License

By contributing to GoNFTme, you agree that your contributions will be licensed under the MIT License.

---

**Ready to contribute?** We'd love to have you join our community of builders creating the future of Web3 crowdfunding! 🚀

**Questions?** Feel free to open a discussion or reach out to the maintainers.

---

*Built with ❤️ by the Web3 community*
