# GoNFTme Project Structure

This document describes the organized structure of the GoNFTme project.

## Directory Structure

```
goNFTme/
├── app/                    # Next.js App Router pages and layouts
│   ├── create/            # Campaign creation page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Homepage
│   └── providers.tsx     # Web3 providers
├── build/                 # Build artifacts (gitignored)
│   ├── artifacts/        # Hardhat compilation artifacts
│   └── cache/            # Hardhat cache
├── components/            # Reusable React components
│   ├── __tests__/        # Component unit tests
│   ├── CampaignCard.tsx  # Campaign display component
│   ├── ConnectWallet.tsx # Wallet connection component
│   └── ErrorBoundary.tsx # Error handling component
├── config/                # Configuration files
│   ├── cucumber.config.js      # Cucumber BDD configuration
│   ├── eslint.config.security.js # ESLint security configuration
│   ├── hardhat.config.js       # Hardhat blockchain configuration
│   ├── jest.config.js          # Jest testing configuration
│   ├── jest.setup.js           # Jest setup and mocks
│   ├── next.config.js          # Next.js configuration
│   ├── playwright.config.ts    # Playwright E2E configuration
│   ├── postcss.config.js       # PostCSS configuration
│   ├── sonar-project.properties # SonarQube configuration
│   └── tailwind.config.js      # Tailwind CSS configuration
├── contracts/             # Smart contracts
│   └── CampaignFactory.sol # Main crowdfunding contract
├── docs/                  # Documentation
│   ├── FINAL_SECURITY_REPORT.md    # Security audit report
│   ├── PROJECT_STRUCTURE.md        # This file
│   ├── SECURITY_ANALYSIS_SUMMARY.md # Security analysis summary
│   ├── SECURITY_AUDIT_REPORT.md    # Detailed security audit
│   ├── SECURITY.md                 # Security policy
│   └── SONARQUBE_ANALYSIS_RESULTS.md # SonarQube results
├── e2e/                   # End-to-end tests
│   ├── features/         # Cucumber feature files
│   ├── steps/           # Cucumber step definitions
│   ├── support/         # Test support files
│   └── basic.spec.ts    # Playwright test specs
├── lib/                   # Utility libraries
│   ├── env.ts           # Environment validation
│   └── web3.ts          # Web3 configuration
├── reports/               # Test reports and coverage (gitignored)
│   ├── coverage/        # Jest coverage reports
│   ├── playwright-report/ # Playwright test reports
│   └── test-results/    # Test result files
├── scripts/               # Deployment and utility scripts
│   └── deploy.js        # Smart contract deployment
├── test/                  # Smart contract tests
│   └── CampaignFactory.test.js # Contract unit tests
├── types/                 # TypeScript type definitions
│   └── index.ts         # Global type definitions
├── utils/                 # Utility functions
│   ├── __tests__/       # Utility unit tests
│   ├── format.ts        # Formatting utilities
│   ├── ipfs.ts          # IPFS utilities
│   └── validation.ts    # Input validation and sanitization
└── Root Configuration Files (proxy to config/)
    ├── jest.config.js         # Jest config proxy
    ├── next.config.js         # Next.js config proxy
    ├── playwright.config.ts   # Playwright config proxy
    └── tailwind.config.js     # Tailwind config proxy
```

## Key Features of This Structure

### 1. **Separation of Concerns**
- **Frontend**: `app/`, `components/`, `lib/`
- **Smart Contracts**: `contracts/`, `scripts/`, `test/`
- **Testing**: `e2e/`, `__tests__/` directories, `test/`
- **Configuration**: `config/` directory
- **Documentation**: `docs/` directory
- **Build Artifacts**: `build/` directory
- **Reports**: `reports/` directory

### 2. **Clean Root Directory**
- Configuration files are organized in `config/`
- Documentation is centralized in `docs/`
- Build artifacts are contained in `build/`
- Test reports are contained in `reports/`

### 3. **Maintainable Configuration**
- All configuration files are in one place
- Root-level proxy files maintain compatibility
- Clear separation between development and production configs

### 4. **Comprehensive Testing**
- Unit tests alongside their respective code
- E2E tests in dedicated directory
- Smart contract tests separate from frontend tests
- All test reports centralized

### 5. **Professional Documentation**
- Security documentation in `docs/`
- Project structure documentation
- Clear README and setup instructions

## Development Workflow

1. **Development**: Use `make dev` to start the development server
2. **Testing**: Use `make test-all` to run all tests
3. **Building**: Use `make compile` to build smart contracts
4. **Security**: Use `make security-full` for comprehensive security analysis
5. **E2E Testing**: Use `make e2e` for end-to-end tests

## Configuration Management

All configuration files are centralized in the `config/` directory:
- Easier to manage and maintain
- Clear separation from application code
- Version controlled alongside code changes
- Consistent naming and organization

This structure supports professional development practices and makes the project easy to understand and maintain.
