# GoNFTme Deployment Guide

## 🚀 Quick Setup for Vercel + GitHub Actions

### Prerequisites
- [ ] GitHub repository
- [ ] Vercel account
- [ ] Domain name purchased
- [ ] Base wallet with ETH for deployments

### 1. Vercel Setup

1. **Connect GitHub to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and link project
   vercel login
   vercel --cwd . --confirm
   ```

2. **Configure Domain**
   - Add your domain in Vercel dashboard
   - Set up DNS records
   - Configure staging subdomain: `staging.gonftme.com`

3. **Environment Variables in Vercel**
   
   **Staging Environment:**
   ```
   NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS=0x39C705725b91F24A372Eb4e43F97AAD07aEfDd62
   NEXTAUTH_URL=https://staging.gonftme.com
   NEXTAUTH_SECRET=[generate-new-secret]
   GOOGLE_CLIENT_ID=[your-google-client-id]
   GOOGLE_CLIENT_SECRET=[your-google-client-secret]
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=[your-project-id]
   NEXT_PUBLIC_ENVIRONMENT=staging
   ```

   **Production Environment:**
   ```
   NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS=[production-contract-address]
   NEXTAUTH_URL=https://gonftme.com
   NEXTAUTH_SECRET=[generate-new-secret]
   GOOGLE_CLIENT_ID=[your-google-client-id]
   GOOGLE_CLIENT_SECRET=[your-google-client-secret]
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=[your-project-id]
   NEXT_PUBLIC_ENVIRONMENT=production
   ```

### 2. GitHub Actions Setup

1. **Add Repository Secrets**
   Go to GitHub → Settings → Secrets and variables → Actions

   ```
   # Vercel Integration
   VERCEL_TOKEN=[vercel-token]
   VERCEL_ORG_ID=[vercel-org-id]
   VERCEL_PROJECT_ID=[vercel-project-id]
   
   # Smart Contract Deployment
   STAGING_CONTRACT_ADDRESS=0x39C705725b91F24A372Eb4e43F97AAD07aEfDd62
   PRODUCTION_CONTRACT_ADDRESS=[production-contract-address]
   MAINNET_PRIVATE_KEY=[production-wallet-private-key]
   ALCHEMY_API_KEY=[alchemy-api-key]
   ETHERSCAN_API_KEY=[etherscan-api-key]
   
   # Authentication
   GOOGLE_CLIENT_ID=[google-client-id]
   GOOGLE_CLIENT_SECRET=[google-client-secret]
   WALLETCONNECT_PROJECT_ID=[walletconnect-project-id]
   
   # Security & Monitoring
   SONAR_TOKEN=[sonar-token]
   SONAR_HOST_URL=https://sonarcloud.io
   SLACK_WEBHOOK_URL=[slack-webhook-for-notifications]
   ```

2. **Update Workflow Files**
   ✅ Already configured for `gonftme.com`

### 3. Branch Strategy

```
main (production)     ← Production deployments
  ↑
develop (staging)     ← Staging deployments, feature integration
  ↑
feature/* branches    ← Feature development
```

**Workflow:**
1. Develop features in `feature/*` branches
2. Merge to `develop` → triggers staging deployment
3. Merge `develop` to `main` → triggers production deployment

### 4. Deployment Commands

```bash
# Deploy to staging
git checkout develop
git push origin develop

# Deploy to production
git checkout main
git merge develop
git push origin main

# Create release
git tag v1.0.0
git push origin v1.0.0
```

### 5. Domain Configuration

**DNS Records:**
```
A     @              [vercel-ip]
CNAME www            gonftme.com
CNAME staging        [vercel-staging-url]
```

**SSL:** Automatically handled by Vercel

### 6. Monitoring Setup

1. **Vercel Analytics**
   - Enable in Vercel dashboard
   - No code changes needed

2. **Sentry (Error Tracking)**
   ```bash
   npm install @sentry/nextjs
   ```

3. **Uptime Monitoring**
   - UptimeRobot or similar
   - Monitor both staging and production

### 7. Security Checklist

- [ ] All secrets stored in GitHub Secrets
- [ ] Environment variables configured per environment
- [ ] Domain SSL certificates active
- [ ] Security headers configured in `vercel.json`
- [ ] Rate limiting enabled
- [ ] Input validation active
- [ ] Smart contracts verified on BaseScan

### 8. Testing Strategy

**Staging Testing:**
- [ ] Automated E2E tests run on every deploy
- [ ] Manual testing before production
- [ ] Smart contract interactions work
- [ ] Authentication flows work
- [ ] NFT minting works

**Production Testing:**
- [ ] Smoke tests after deployment
- [ ] Monitor error rates
- [ ] Performance monitoring
- [ ] User feedback collection

## 🔧 Advanced Features Setup

### Enhanced NFT Overlays

1. **Enable Feature Flag**
   ```
   NEXT_PUBLIC_ENABLE_ENHANCED_NFTS=true
   ```

2. **Canvas API Setup**
   - Already included in `utils/nft-image-generator.ts`
   - Supports animations, gradients, custom fonts

### Farcaster Integration

1. **Enable Feature Flag**
   ```
   NEXT_PUBLIC_ENABLE_FARCASTER=true
   ```

2. **Install Farcaster SDK**
   ```bash
   npm install @farcaster/hub-web
   ```

3. **Configuration**
   ```typescript
   // lib/farcaster.ts
   export const farcasterConfig = {
     hubUrl: 'https://hub-api.farcaster.xyz',
     // Add your Farcaster app configuration
   }
   ```

### IPFS Production Setup

1. **Pinata Configuration**
   ```bash
   npm install pinata
   ```

2. **Environment Variables**
   ```
   PINATA_API_KEY=your_pinata_api_key
   PINATA_SECRET_API_KEY=your_pinata_secret_key
   PINATA_JWT=your_pinata_jwt
   ```

3. **Update Storage Utils**
   - Replace `localStorage` with Pinata in `utils/ipfs.ts`
   - Implement proper IPFS pinning

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. **Environment Variable Issues**
   - Check Vercel dashboard environment variables
   - Ensure secrets are properly set in GitHub
   - Restart deployments after changes

3. **Smart Contract Issues**
   - Verify contract is deployed and verified
   - Check network configuration
   - Ensure sufficient gas for transactions

4. **Authentication Issues**
   - Verify Google OAuth configuration
   - Check NEXTAUTH_URL matches deployment URL
   - Ensure secrets are properly configured

### Support

- **Documentation:** Check `docs/COMPLETE_LEARNING_GUIDE.md`
- **Logs:** Check Vercel function logs
- **Monitoring:** Check Sentry dashboard
- **Blockchain:** Check BaseScan for transaction details

---

**Ready to deploy!** 🚀

Follow this guide step by step, and you'll have a production-ready Web3 crowdfunding platform with proper CI/CD, monitoring, and security.
