
# 🚀 GoNFTme Deployment Checklist

## Domain: gonftme.com

### 1. GitHub Repository Setup
- [ ] Push all code to GitHub
- [ ] Create `develop` branch for staging
- [ ] Set up branch protection rules

### 2. Vercel Setup
- [ ] Connect GitHub repository to Vercel
- [ ] Add domain: gonftme.com
- [ ] Configure DNS records:
  ```
  A     @              [vercel-ip]
  CNAME www            gonftme.com
  CNAME staging        [vercel-staging-url]
  ```

### 3. GitHub Secrets (Repository → Settings → Secrets and variables → Actions)
```
# Vercel Integration
VERCEL_TOKEN=[create-new-token-in-vercel-account-settings]
VERCEL_ORG_ID=team_7Bo0zXnvyT86MNU7i7ZcRqw5
VERCEL_PROJECT_ID=prj_RoMqXwDicdh7NPY1vDYclwMXtD43

# Smart Contract
STAGING_CONTRACT_ADDRESS=0x39C705725b91F24A372Eb4e43F97AAD07aEfDd62
PRODUCTION_CONTRACT_ADDRESS=[deploy-to-mainnet-first]
MAINNET_PRIVATE_KEY=[production-wallet-private-key]
ALCHEMY_API_KEY=[your-alchemy-key]
ETHERSCAN_API_KEY=[your-etherscan-key]

# Authentication
GOOGLE_CLIENT_ID=[your-google-client-id]
GOOGLE_CLIENT_SECRET=[your-google-client-secret]
WALLETCONNECT_PROJECT_ID=[your-walletconnect-project-id]

# Monitoring
SONAR_TOKEN=507dd02aea011bf2fda2dd8c3c973ceedae30be9
SONAR_HOST_URL=https://sonarcloud.io
```

### 4. Vercel Environment Variables

**Staging Environment:**
```
NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS=0x39C705725b91F24A372Eb4e43F97AAD07aEfDd62
NEXTAUTH_URL=https://staging.gonftme.com
NEXTAUTH_SECRET=[use-generated-staging-secret]
GOOGLE_CLIENT_ID=[your-google-client-id]
GOOGLE_CLIENT_SECRET=[your-google-client-secret]
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=[your-project-id]
NEXT_PUBLIC_ENVIRONMENT=staging
```

**Production Environment:**
```
NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS=[production-contract-address]
NEXTAUTH_URL=https://gonftme.com
NEXTAUTH_SECRET=[use-generated-production-secret]
GOOGLE_CLIENT_ID=[your-google-client-id]
GOOGLE_CLIENT_SECRET=[your-google-client-secret]
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=[your-project-id]
NEXT_PUBLIC_ENVIRONMENT=production
```

### 5. Deployment Commands
```bash
# Initial setup
git checkout -b develop
git push -u origin develop

# Deploy to staging
git checkout develop
git push origin develop

# Deploy to production
git checkout main
git merge develop
git push origin main
```

### 6. Testing Checklist
- [ ] Staging deployment successful
- [ ] Domain resolves correctly
- [ ] SSL certificates active
- [ ] Authentication works
- [ ] Smart contract interactions work
- [ ] NFT minting works
- [ ] All tests pass in CI/CD

### 7. Go Live
- [ ] Production deployment successful
- [ ] Monitor error rates
- [ ] Test core functionality
- [ ] Announce launch! 🎉

---
Generated on: 2025-08-18T21:21:10.906Z
Domain: gonftme.com
Staging: staging.gonftme.com
