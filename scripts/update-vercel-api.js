#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

// Vercel project configuration
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_PROJECT_ID = 'prj_RoMqXwDicdh7NPY1vDYclwMXtD43';
const VERCEL_TEAM_ID = 'team_7Bo0zXnvyT86MNU7i7ZcRqw5';

console.log('🔄 Updating Vercel environment variables via API...');

// Get the latest contract address
function getLatestContractAddress() {
  try {
    // Read from lib/web3.ts
    const web3Config = fs.readFileSync('lib/web3.ts', 'utf8');
    
    // Try multiple patterns to find the contract address
    let addressMatch;
    
    // Pattern 1: Look for the default fallback address
    addressMatch = web3Config.match(/process\.env\.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS.*?['"`]([0x][a-fA-F0-9]{40})['"`]/);
    if (addressMatch) {
      return addressMatch[1];
    }
    
    // Pattern 2: Look for any 0x address
    addressMatch = web3Config.match(/['"`](0x[a-fA-F0-9]{40})['"`]/);
    if (addressMatch) {
      return addressMatch[1];
    }
    
    // Pattern 3: Look in CONTRACT_ADDRESSES
    addressMatch = web3Config.match(/CONTRACT_ADDRESSES[\s\S]*?['"`](0x[a-fA-F0-9]{40})['"`]/);
    if (addressMatch) {
      return addressMatch[1];
    }
    
    throw new Error('Contract address not found in lib/web3.ts');
  } catch (error) {
    console.error('❌ Error reading contract address:', error.message);
    console.log('💡 Make sure lib/web3.ts contains a valid contract address');
    process.exit(1);
  }
}

// Make API request to Vercel
function makeVercelRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.vercel.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsedData);
          } else {
            reject(new Error(`API Error: ${res.statusCode} - ${parsedData.error?.message || responseData}`));
          }
        } catch (e) {
          reject(new Error(`Parse Error: ${e.message} - ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Update environment variable
async function updateEnvironmentVariable(contractAddress) {
  try {
    console.log(`📝 Updating NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS to: ${contractAddress}`);
    
    // First, try to delete existing environment variable
    try {
      await makeVercelRequest(
        'DELETE', 
        `/v9/projects/${VERCEL_PROJECT_ID}/env/NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS?teamId=${VERCEL_TEAM_ID}`
      );
      console.log('🗑️ Removed existing environment variable');
    } catch (error) {
      console.log('ℹ️ No existing environment variable to remove (this is fine)');
    }
    
    // Create new environment variable
    const envData = {
      key: 'NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS',
      value: contractAddress,
      type: 'encrypted',
      target: ['production', 'preview', 'development']
    };
    
    const result = await makeVercelRequest(
      'POST',
      `/v10/projects/${VERCEL_PROJECT_ID}/env?teamId=${VERCEL_TEAM_ID}`,
      envData
    );
    
    console.log('✅ Environment variable updated successfully');
    console.log('🚀 Vercel will automatically redeploy with the new environment variable');
    console.log(`🔗 Monitor deployment: https://vercel.com/dashboard/${VERCEL_PROJECT_ID}`);
    
  } catch (error) {
    console.error('❌ Error updating Vercel environment:', error.message);
    console.log('💡 Fallback: Update manually in Vercel dashboard');
    console.log(`🔗 https://vercel.com/dashboard/${VERCEL_PROJECT_ID}/settings/environment-variables`);
    throw error;
  }
}

// Main execution
async function main() {
  if (!VERCEL_TOKEN) {
    console.error('❌ VERCEL_TOKEN environment variable not set');
    process.exit(1);
  }
  
  const contractAddress = getLatestContractAddress();
  console.log(`🔍 Found contract address: ${contractAddress}`);
  
  await updateEnvironmentVariable(contractAddress);
}

main().catch((error) => {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
});
