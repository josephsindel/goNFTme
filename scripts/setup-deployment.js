#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 GoNFTme Deployment Setup');
console.log('============================\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Please run this script from the project root directory');
  process.exit(1);
}

// Helper functions
function prompt(question) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise(resolve => {
    readline.question(question, answer => {
      readline.close();
      resolve(answer);
    });
  });
}

function generateSecret() {
  return require('crypto').randomBytes(32).toString('hex');
}

function runCommand(command, description) {
  console.log(`🔧 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log('✅ Success!\n');
    return true;
  } catch (error) {
    console.log(`❌ Failed: ${error.message}\n`);
    return false;
  }
}

async function main() {
  console.log('This script will help you set up deployment for GoNFTme.\n');
  
  // Step 1: Domain Configuration
  console.log('📋 Step 1: Domain Configuration');
  console.log('================================');
  const domain = 'gonftme.com'; // Pre-configured domain
  const stagingDomain = `staging.${domain}`;
  
  console.log(`✅ Domain: ${domain}`);
  console.log(`✅ Staging: ${stagingDomain}\n`);
  
  // Step 2: Update workflow files with actual domain
  console.log('🔧 Step 2: Updating GitHub Actions workflows...');
  
  const ciWorkflow = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
  const updatedCiWorkflow = ciWorkflow
    .replace(/yourdomain\.com/g, domain)
    .replace(/staging\.yourdomain\.com/g, stagingDomain);
  fs.writeFileSync('.github/workflows/ci.yml', updatedCiWorkflow);
  
  const releaseWorkflow = fs.readFileSync('.github/workflows/release.yml', 'utf8');
  const updatedReleaseWorkflow = releaseWorkflow
    .replace(/yourdomain\.com/g, domain);
  fs.writeFileSync('.github/workflows/release.yml', updatedReleaseWorkflow);
  
  console.log('✅ GitHub Actions updated with your domain\n');
  
  // Step 3: Environment Setup
  console.log('📋 Step 3: Environment Configuration');
  console.log('====================================');
  
  const secrets = {
    NEXTAUTH_SECRET_STAGING: generateSecret(),
    NEXTAUTH_SECRET_PRODUCTION: generateSecret()
  };
  
  console.log('🔑 Generated NextAuth secrets:');
  console.log(`Staging: ${secrets.NEXTAUTH_SECRET_STAGING}`);
  console.log(`Production: ${secrets.NEXTAUTH_SECRET_PRODUCTION}\n`);
  
  // Step 4: Create deployment checklist
  const checklist = `
# 🚀 GoNFTme Deployment Checklist

## Domain: ${domain}

### 1. GitHub Repository Setup
- [ ] Push all code to GitHub
- [ ] Create \`develop\` branch for staging
- [ ] Set up branch protection rules

### 2. Vercel Setup
- [ ] Connect GitHub repository to Vercel
- [ ] Add domain: ${domain}
- [ ] Configure DNS records:
  \`\`\`
  A     @              [vercel-ip]
  CNAME www            ${domain}
  CNAME staging        [vercel-staging-url]
  \`\`\`

### 3. GitHub Secrets (Repository → Settings → Secrets and variables → Actions)
\`\`\`
# Vercel Integration
VERCEL_TOKEN=[get-from-vercel-settings]
VERCEL_ORG_ID=[get-from-vercel-settings]
VERCEL_PROJECT_ID=[get-from-vercel-settings]

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
\`\`\`

### 4. Vercel Environment Variables

**Staging Environment:**
\`\`\`
NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS=0x39C705725b91F24A372Eb4e43F97AAD07aEfDd62
NEXTAUTH_URL=https://${stagingDomain}
NEXTAUTH_SECRET=${secrets.NEXTAUTH_SECRET_STAGING}
GOOGLE_CLIENT_ID=[your-google-client-id]
GOOGLE_CLIENT_SECRET=[your-google-client-secret]
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=[your-project-id]
NEXT_PUBLIC_ENVIRONMENT=staging
\`\`\`

**Production Environment:**
\`\`\`
NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS=[production-contract-address]
NEXTAUTH_URL=https://${domain}
NEXTAUTH_SECRET=${secrets.NEXTAUTH_SECRET_PRODUCTION}
GOOGLE_CLIENT_ID=[your-google-client-id]
GOOGLE_CLIENT_SECRET=[your-google-client-secret]
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=[your-project-id]
NEXT_PUBLIC_ENVIRONMENT=production
\`\`\`

### 5. Deployment Commands
\`\`\`bash
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
\`\`\`

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
Generated on: ${new Date().toISOString()}
Domain: ${domain}
Staging: ${stagingDomain}
`;
  
  fs.writeFileSync('DEPLOYMENT_CHECKLIST.md', checklist);
  console.log('✅ Created DEPLOYMENT_CHECKLIST.md with your specific configuration\n');
  
  // Step 5: Git setup
  console.log('📋 Step 5: Git Branch Setup');
  console.log('============================');
  
  const setupGit = await prompt('Set up develop branch now? (y/n): ');
  if (setupGit.toLowerCase() === 'y') {
    console.log('🔧 Setting up git branches...');
    
    // Check if develop branch exists
    try {
      execSync('git checkout develop', { stdio: 'pipe' });
      console.log('✅ Develop branch already exists');
    } catch {
      // Create develop branch
      runCommand('git checkout -b develop', 'Creating develop branch');
      runCommand('git push -u origin develop', 'Pushing develop branch to remote');
    }
    
    runCommand('git checkout main', 'Switching back to main branch');
  }
  
  // Step 6: Final instructions
  console.log('🎉 Setup Complete!');
  console.log('==================');
  console.log('Next steps:');
  console.log('1. Review DEPLOYMENT_CHECKLIST.md');
  console.log('2. Set up Vercel account and connect repository');
  console.log('3. Configure DNS records for your domain');
  console.log('4. Add GitHub secrets and Vercel environment variables');
  console.log('5. Push to develop branch to test staging deployment');
  console.log('');
  console.log('📖 Full guide: docs/DEPLOYMENT_GUIDE.md');
  console.log('📋 Checklist: DEPLOYMENT_CHECKLIST.md');
  console.log('');
  console.log('🚀 Ready to deploy!');
}

main().catch(console.error);
