#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Updating Vercel environment variables...');

// Read the new contract address from the deployment output
function getLatestContractAddress() {
  try {
    // Check if there's a deployment log file
    if (fs.existsSync('deployment-log.json')) {
      const deploymentLog = JSON.parse(fs.readFileSync('deployment-log.json', 'utf8'));
      return deploymentLog.contractAddress;
    }
    
    // Fallback: read from lib/web3.ts
    const web3Config = fs.readFileSync('lib/web3.ts', 'utf8');
    const addressMatch = web3Config.match(/84532.*?:\s*['"`]([^'"`]+)['"`]/);
    if (addressMatch) {
      return addressMatch[1];
    }
    
    throw new Error('Contract address not found');
  } catch (error) {
    console.error('❌ Error reading contract address:', error.message);
    process.exit(1);
  }
}

// Update Vercel environment variable
function updateVercelEnv(contractAddress) {
  try {
    console.log(`📝 Updating NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS to: ${contractAddress}`);
    
    // Update using Vercel CLI
    const command = `vercel env add NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS production --force`;
    
    // Create a temporary file with the contract address
    fs.writeFileSync('.temp-contract-address', contractAddress);
    
    // Use vercel CLI to update the environment variable
    execSync(`echo "${contractAddress}" | vercel env add NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS production --force`, {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    // Clean up temp file
    if (fs.existsSync('.temp-contract-address')) {
      fs.unlinkSync('.temp-contract-address');
    }
    
    console.log('✅ Vercel environment variable updated successfully');
    
    // Trigger a new deployment
    console.log('🚀 Triggering new deployment...');
    execSync('vercel --prod', { stdio: 'inherit' });
    
    console.log('🎉 Deployment triggered with new contract address!');
    
  } catch (error) {
    console.error('❌ Error updating Vercel environment:', error.message);
    console.log('💡 You may need to update manually in Vercel dashboard');
    process.exit(1);
  }
}

// Main execution
async function main() {
  const contractAddress = getLatestContractAddress();
  console.log(`🔍 Found contract address: ${contractAddress}`);
  
  updateVercelEnv(contractAddress);
}

main().catch(console.error);
