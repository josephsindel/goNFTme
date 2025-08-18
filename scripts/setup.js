#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

// Helper function to read current environment
function readCurrentEnv() {
  const envPath = path.join(process.cwd(), '.env.local')
  let currentEnv = {}
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=')
      if (key && value) {
        currentEnv[key] = value
      }
    })
  }
  
  return currentEnv
}

// Helper function to display current configuration
function displayCurrentConfig(currentEnv) {
  console.log('📋 Current configuration:')
  console.log(`   Alchemy API Key: ${currentEnv.NEXT_PUBLIC_ALCHEMY_API_KEY || 'Not set'}`)
  console.log(`   WalletConnect Project ID: ${currentEnv.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'Not set'}`)
  console.log(`   Private Key: ${currentEnv.PRIVATE_KEY ? 'Set' : 'Not set'}`)
  console.log(`   Contract Address: ${currentEnv.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS || 'Not deployed'}\n`)
}

// Helper function to setup Alchemy API key
async function setupAlchemyKey(currentKey) {
  if (currentKey && currentKey !== 'your_alchemy_api_key_here') {
    return currentKey
  }
  
  console.log('🔑 Alchemy API Key Setup:')
  console.log('   1. Go to https://www.alchemy.com/')
  console.log('   2. Sign up for a free account')
  console.log('   3. Create a new app on Base Sepolia network')
  console.log('   4. Copy the API key')
  
  const alchemyKey = await question('\n   Enter your Alchemy API key (or press Enter to skip): ')
  if (!alchemyKey) {
    console.log('   ⚠️  Skipping Alchemy setup - you can add this later')
    return 'your_alchemy_api_key_here'
  }
  return alchemyKey
}

// Helper function to setup WalletConnect Project ID
async function setupWalletConnectId(currentId) {
  if (currentId && currentId !== 'your_walletconnect_project_id_here') {
    return currentId
  }
  
  console.log('\n🔗 WalletConnect Project ID (Optional):')
  console.log('   1. Go to https://cloud.walletconnect.com/')
  console.log('   2. Create a project')
  console.log('   3. Copy the Project ID')
  
  const walletConnectId = await question('\n   Enter your WalletConnect Project ID (or press Enter to skip): ')
  if (!walletConnectId) {
    console.log('   ⚠️  Skipping WalletConnect - Coinbase Wallet will still work')
    return 'your_walletconnect_project_id_here'
  }
  return walletConnectId
}

// Helper function to setup private key
async function setupPrivateKey(currentKey) {
  if (currentKey && currentKey !== 'your_private_key_here') {
    return currentKey
  }
  
  console.log('\n🔐 Private Key Setup:')
  console.log('   ⚠️  WARNING: This is for TESTNET ONLY!')
  console.log('   ⚠️  NEVER use your main wallet private key!')
  console.log('   ⚠️  Create a separate wallet for testing!')
  console.log('')
  console.log('   1. Create a new wallet in MetaMask/Coinbase Wallet')
  console.log('   2. Export the private key (starts with 0x)')
  console.log('   3. Add Base Sepolia network to your wallet')
  console.log('   4. Get testnet ETH from https://bridge.base.org/deposit')
  
  const privateKey = await question('\n   Enter your TESTNET private key (or press Enter to skip): ')
  if (!privateKey) {
    console.log('   ⚠️  Skipping private key - you can add this later for deployment')
    return 'your_private_key_here'
  }
  return privateKey
}

// Helper function to write environment file
function writeEnvFile(currentEnv, alchemyKey, walletConnectId, privateKey) {
  const envPath = path.join(process.cwd(), '.env.local')
  const envContent = `# Blockchain Configuration
NEXT_PUBLIC_ALCHEMY_API_KEY=${alchemyKey}
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=${walletConnectId}

# Private Keys (for deployment only - never commit real private keys!)
PRIVATE_KEY=${privateKey}

# Contract Addresses (will be populated after deployment)
NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS=${currentEnv.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS || ''}

# Base Network URLs
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# IPFS Configuration (if needed)
PINATA_API_KEY=your_pinata_api_key_here
PINATA_SECRET_API_KEY=your_pinata_secret_key_here

# SonarQube Configuration
SONAR_TOKEN=${currentEnv.SONAR_TOKEN || 'your_sonar_token_here'}
`
  
  fs.writeFileSync(envPath, envContent)
  console.log('\n✅ Environment configuration saved!')
}

// Helper function to attempt deployment
async function attemptDeployment(privateKey, alchemyKey) {
  const canDeploy = privateKey && privateKey !== 'your_private_key_here' && 
                   alchemyKey && alchemyKey !== 'your_alchemy_api_key_here'
  
  if (!canDeploy) return false
  
  const deploy = await question('\n🚀 Ready to deploy smart contract to Base Sepolia? (y/N): ')
  if (deploy.toLowerCase() !== 'y' && deploy.toLowerCase() !== 'yes') {
    return false
  }
  
  console.log('\n📡 Deploying contract...')
  rl.close()
  
  const { execSync } = require('child_process')
  try {
    execSync('npm run deploy:base-sepolia', { stdio: 'inherit' })
    console.log('\n✅ Deployment complete!')
    console.log('🔄 Restart your dev server to pick up the new contract address')
    return true
  } catch (error) {
    console.error('❌ Deployment failed:', error.message)
    return true // Still deployed, even if failed
  }
}

// Helper function to show next steps
function showNextSteps(currentEnv, alchemyKey, privateKey) {
  console.log('\n📋 Next Steps:')
  if (alchemyKey === 'your_alchemy_api_key_here') {
    console.log('   1. Get an Alchemy API key from https://www.alchemy.com/')
  }
  if (privateKey === 'your_private_key_here') {
    console.log('   2. Add your testnet private key to .env.local')
    console.log('   3. Get Base Sepolia ETH from https://bridge.base.org/deposit')
  }
  if (!currentEnv.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS) {
    console.log('   4. Run: npm run deploy:base-sepolia')
    console.log('   5. Update NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS in .env.local')
  }
  console.log('   6. Restart dev server: npm run dev')
  console.log('\n🎯 Or run this script again after adding the missing values!')
}

async function setup() {
  console.log('🚀 GoNFTme Setup Wizard')
  console.log('========================\n')
  
  console.log('This will help you configure your environment for testing on Base Sepolia testnet.\n')
  
  const currentEnv = readCurrentEnv()
  displayCurrentConfig(currentEnv)
  
  // Setup configuration values
  const alchemyKey = await setupAlchemyKey(currentEnv.NEXT_PUBLIC_ALCHEMY_API_KEY)
  const walletConnectId = await setupWalletConnectId(currentEnv.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID)
  const privateKey = await setupPrivateKey(currentEnv.PRIVATE_KEY)
  
  // Write environment configuration
  writeEnvFile(currentEnv, alchemyKey, walletConnectId, privateKey)
  
  // Attempt deployment if possible
  const deployed = await attemptDeployment(privateKey, alchemyKey)
  if (deployed) {
    return
  }
  
  // Show next steps
  showNextSteps(currentEnv, alchemyKey, privateKey)
  rl.close()
}

setup().catch(console.error)
