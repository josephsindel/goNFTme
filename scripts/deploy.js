const { ethers } = require("hardhat");
require("dotenv").config();
const fs = require('fs');
const path = require('path');

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
        
        const hre = require("hardhat");
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