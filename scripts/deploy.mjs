import pkg from "hardhat";
const { ethers } = pkg;
import dotenv from "dotenv";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  console.log("🚀 Deploying fresh CampaignFactory contract...");
  
  // Verify environment
  if (!process.env.PRIVATE_KEY) {
    throw new Error("❌ PRIVATE_KEY not found in environment variables");
  }
  
  console.log("✅ Private key loaded");

  // Get the deployer account
  const signers = await ethers.getSigners();
  
  if (signers.length === 0) {
    throw new Error("❌ No signers available. Check your PRIVATE_KEY configuration");
  }
  
  const deployer = signers[0];
  const deployerAddress = await deployer.getAddress();
  console.log("📝 Deploying with account:", deployerAddress);
  
  const balance = await ethers.provider.getBalance(deployerAddress);
  const balanceEth = ethers.formatEther(balance);
  console.log("💰 Account balance:", balanceEth, "ETH");
  
  if (parseFloat(balanceEth) < 0.001) {
    console.log("⚠️  Warning: Low balance. You may need more ETH for deployment.");
  }

  // Ensure contract is compiled
  try {
    const CampaignFactory = await ethers.getContractFactory("CampaignFactory");
    console.log("✅ Contract artifacts found");
    
    // Deploy the contract
    console.log("🔨 Deploying contract...");
    const campaignFactory = await CampaignFactory.deploy();
    console.log("⏳ Waiting for deployment confirmation...");
    await campaignFactory.waitForDeployment();

    const contractAddress = await campaignFactory.getAddress();
    console.log("🎉 CampaignFactory deployed to:", contractAddress);

    // Update the frontend configuration automatically
    console.log("📝 Updating frontend configuration...");
    const web3FilePath = path.join(__dirname, '../lib/web3.ts');
    
    try {
      let web3Content = fs.readFileSync(web3FilePath, 'utf8');
      
      // Replace the contract address
      const addressRegex = /CONTRACT_ADDRESSES = \{[\s\S]*?\}/;
      const newAddresses = `CONTRACT_ADDRESSES = {
  [base.id]: process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS || '${contractAddress}',
  [baseSepolia.id]: process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS || '${contractAddress}',
} as const`;
      
      web3Content = web3Content.replace(addressRegex, newAddresses);
      fs.writeFileSync(web3FilePath, web3Content);
      
      console.log("✅ Frontend configuration updated automatically");
    } catch (error) {
      console.log("⚠️  Failed to update frontend config:", error.message);
      console.log("📝 Please manually update the contract address in lib/web3.ts");
    }

    // Verify the contract on Basescan (if not local network)
    const network = await ethers.provider.getNetwork();
    console.log("🌐 Network:", network.name, "Chain ID:", network.chainId.toString());

    if (network.chainId !== 1337n) {
      console.log("🔍 Attempting contract verification on Basescan...");
      try {
        console.log("⏳ Waiting for block confirmations...");
        await campaignFactory.deploymentTransaction().wait(5);
        
        const hre = pkg;
        await hre.run("verify:verify", {
          address: contractAddress,
          constructorArguments: [],
        });
        console.log("✅ Contract verified on Basescan");
      } catch (error) {
        console.log("⚠️  Verification failed (this is optional):", error.message);
      }
    }

    console.log("\n🎉 Deployment Complete!");
    console.log("========================");
    console.log("📄 Contract Address:", contractAddress);
    console.log("🌐 Network:", network.name);
    console.log("👤 Deployer:", deployerAddress);
    console.log("💰 Balance:", ethers.formatEther(balance), "ETH");
    console.log("🔗 BaseScan:", `https://sepolia.basescan.org/address/${contractAddress}`);
    console.log("");
    console.log("🧹 Fresh contract deployed - no existing campaigns or NFTs!");
    console.log("🚀 You can now test with a completely clean slate.");
    
    // Auto-update Vercel environment variables
    if (process.env.VERCEL_TOKEN) {
      console.log('\n🔄 Auto-updating Vercel environment variables...')
      try {
        (await import('child_process')).execSync('node scripts/update-vercel-api.js', { stdio: 'inherit' })
        console.log('✅ Vercel updated automatically!')
      } catch (error) {
        console.log('⚠️ Vercel auto-update failed, update manually')
        console.log(`🔗 Update NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS to: ${contractAddress}`)
      }
    } else {
      console.log('\n💡 To enable auto-update of Vercel:')
      console.log('   export VERCEL_TOKEN=your_vercel_token_here')
      console.log('   Then run deployment again')
    }
    
  } catch (error) {
    console.error("❌ Contract deployment failed:", error.message);
    console.log("💡 Try running: npx hardhat compile");
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 