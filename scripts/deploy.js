const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying CampaignFactory contract...");

  // Get the contract factory
  const CampaignFactory = await ethers.getContractFactory("CampaignFactory");

  // Deploy the contract
  const campaignFactory = await CampaignFactory.deploy();
  await campaignFactory.waitForDeployment();

  const contractAddress = await campaignFactory.getAddress();
  console.log("CampaignFactory deployed to:", contractAddress);

  // Verify the contract on Basescan (if not local network)
  const network = await ethers.provider.getNetwork();
  console.log("Network:", network.name, "Chain ID:", network.chainId);

  if (network.chainId !== 1337n) {
    console.log("Waiting for block confirmations...");
    await campaignFactory.deploymentTransaction().wait(5);

    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("Contract verified on Basescan");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }

  console.log("\n📝 Contract deployment summary:");
  console.log("=====================================");
  console.log("Contract Address:", contractAddress);
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId.toString());
  console.log("\n🔧 Next steps:");
  console.log("1. Update your .env file with:");
  console.log(`   NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS=${contractAddress}`);
  console.log("2. Run 'make dev' to start the frontend");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 