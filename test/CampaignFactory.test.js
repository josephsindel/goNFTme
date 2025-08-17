const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CampaignFactory", function () {
  let campaignFactory;
  let owner;
  let creator;
  let recipient;
  let donor1;
  let donor2;

  beforeEach(async function () {
    [owner, creator, recipient, donor1, donor2] = await ethers.getSigners();
    
    const CampaignFactory = await ethers.getContractFactory("CampaignFactory");
    campaignFactory = await CampaignFactory.deploy();
    await campaignFactory.waitForDeployment();
  });

  describe("Campaign Creation", function () {
    it("Should create a campaign successfully", async function () {
      const title = "Test Campaign";
      const description = "Test Description";
      const imageUri = "https://example.com/image.jpg";
      const goalAmount = ethers.parseEther("1.0");

      const tx = await campaignFactory.connect(creator).createCampaign(
        title,
        description,
        imageUri,
        goalAmount,
        recipient.address
      );

      await expect(tx)
        .to.emit(campaignFactory, "CampaignCreated")
        .withArgs(0, creator.address, recipient.address, title, goalAmount);

      const campaign = await campaignFactory.getCampaign(0);
      expect(campaign.title).to.equal(title);
      expect(campaign.description).to.equal(description);
      expect(campaign.goalAmount).to.equal(goalAmount);
      expect(campaign.creator).to.equal(creator.address);
      expect(campaign.recipient).to.equal(recipient.address);
      expect(campaign.isActive).to.be.true;
      expect(campaign.raisedAmount).to.equal(0);
      expect(campaign.totalDonors).to.equal(0);
    });

    it("Should reject campaign with zero goal", async function () {
      await expect(
        campaignFactory.connect(creator).createCampaign(
          "Test",
          "Test",
          "image",
          0,
          recipient.address
        )
      ).to.be.revertedWith("Goal amount must be greater than 0");
    });

    it("Should reject campaign with empty title", async function () {
      await expect(
        campaignFactory.connect(creator).createCampaign(
          "",
          "Test",
          "image",
          ethers.parseEther("1.0"),
          recipient.address
        )
      ).to.be.revertedWith("Title cannot be empty");
    });

    it("Should reject campaign with zero recipient address", async function () {
      await expect(
        campaignFactory.connect(creator).createCampaign(
          "Test",
          "Test",
          "image",
          ethers.parseEther("1.0"),
          ethers.ZeroAddress
        )
      ).to.be.revertedWith("Recipient cannot be zero address");
    });

    it("Should reject campaign with goal amount too large", async function () {
      await expect(
        campaignFactory.connect(creator).createCampaign(
          "Test",
          "Test",
          "image",
          ethers.parseEther("1001"), // Over 1000 ETH limit
          recipient.address
        )
      ).to.be.revertedWith("Goal amount too large");
    });

    it("Should reject campaign with title too long", async function () {
      const longTitle = "a".repeat(201); // Over 200 char limit
      await expect(
        campaignFactory.connect(creator).createCampaign(
          longTitle,
          "Test",
          "image",
          ethers.parseEther("1.0"),
          recipient.address
        )
      ).to.be.revertedWith("Title too long");
    });

    it("Should reject campaign with description too long", async function () {
      const longDescription = "a".repeat(1001); // Over 1000 char limit
      await expect(
        campaignFactory.connect(creator).createCampaign(
          "Test",
          longDescription,
          "image",
          ethers.parseEther("1.0"),
          recipient.address
        )
      ).to.be.revertedWith("Description too long");
    });

    it("Should reject campaign with contract as recipient", async function () {
      await expect(
        campaignFactory.connect(creator).createCampaign(
          "Test",
          "Test",
          "image",
          ethers.parseEther("1.0"),
          await campaignFactory.getAddress()
        )
      ).to.be.revertedWith("Recipient cannot be contract address");
    });
  });

  describe("Donations", function () {
    let campaignId;
    const goalAmount = ethers.parseEther("1.0");

    beforeEach(async function () {
      await campaignFactory.connect(creator).createCampaign(
        "Test Campaign",
        "Test Description",
        "https://example.com/image.jpg",
        goalAmount,
        recipient.address
      );
      campaignId = 0;
    });

    it("Should accept donations and mint NFTs", async function () {
      const donationAmount = ethers.parseEther("0.5");
      const tokenUri = "https://example.com/token/1";

      const initialBalance = await ethers.provider.getBalance(recipient.address);

      const tx = await campaignFactory.connect(donor1).donate(campaignId, tokenUri, {
        value: donationAmount
      });

      await expect(tx)
        .to.emit(campaignFactory, "DonationMade")
        .withArgs(campaignId, donor1.address, donationAmount, 0, 1, 1);

      // Check campaign updated
      const campaign = await campaignFactory.getCampaign(campaignId);
      expect(campaign.raisedAmount).to.equal(donationAmount);
      expect(campaign.totalDonors).to.equal(1);
      expect(campaign.isActive).to.be.true;

      // Check NFT minted
      expect(await campaignFactory.ownerOf(0)).to.equal(donor1.address);
      expect(await campaignFactory.tokenURI(0)).to.equal(tokenUri);

      // Check funds transferred
      const finalBalance = await ethers.provider.getBalance(recipient.address);
      expect(finalBalance - initialBalance).to.equal(donationAmount);

      // Check donation record
      const donation = await campaignFactory.getDonation(0);
      expect(donation.campaignId).to.equal(campaignId);
      expect(donation.donor).to.equal(donor1.address);
      expect(donation.amount).to.equal(donationAmount);
      expect(donation.donorNumber).to.equal(1);
    });

    it("Should complete campaign when goal is reached", async function () {
      const tokenUri = "https://example.com/token/1";

      const tx = await campaignFactory.connect(donor1).donate(campaignId, tokenUri, {
        value: goalAmount
      });

      await expect(tx)
        .to.emit(campaignFactory, "CampaignCompleted")
        .withArgs(campaignId, goalAmount);

      const campaign = await campaignFactory.getCampaign(campaignId);
      expect(campaign.isActive).to.be.false;
      expect(campaign.raisedAmount).to.equal(goalAmount);
    });

    it("Should refund excess donation amount", async function () {
      const excessAmount = ethers.parseEther("1.5");
      const tokenUri = "https://example.com/token/1";

      const initialBalance = await ethers.provider.getBalance(donor1.address);
      const initialRecipientBalance = await ethers.provider.getBalance(recipient.address);

      const tx = await campaignFactory.connect(donor1).donate(campaignId, tokenUri, {
        value: excessAmount
      });
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      // Check only goal amount was transferred to recipient
      const finalRecipientBalance = await ethers.provider.getBalance(recipient.address);
      expect(finalRecipientBalance - initialRecipientBalance).to.equal(goalAmount);

      // Check donor was refunded excess (minus gas)
      const finalBalance = await ethers.provider.getBalance(donor1.address);
      const expectedBalance = initialBalance - goalAmount - gasUsed;
      expect(finalBalance).to.be.closeTo(expectedBalance, ethers.parseEther("0.001"));

      const campaign = await campaignFactory.getCampaign(campaignId);
      expect(campaign.raisedAmount).to.equal(goalAmount);
      expect(campaign.isActive).to.be.false;
    });

    it("Should handle multiple donors correctly", async function () {
      const donation1 = ethers.parseEther("0.3");
      const donation2 = ethers.parseEther("0.7");

      await campaignFactory.connect(donor1).donate(campaignId, "uri1", {
        value: donation1
      });

      await campaignFactory.connect(donor2).donate(campaignId, "uri2", {
        value: donation2
      });

      const campaign = await campaignFactory.getCampaign(campaignId);
      expect(campaign.totalDonors).to.equal(2);
      expect(campaign.raisedAmount).to.equal(donation1 + donation2);
      expect(campaign.isActive).to.be.false; // Goal reached

      // Check both NFTs were minted
      expect(await campaignFactory.ownerOf(0)).to.equal(donor1.address);
      expect(await campaignFactory.ownerOf(1)).to.equal(donor2.address);

      // Check donor numbers
      const donation1Record = await campaignFactory.getDonation(0);
      const donation2Record = await campaignFactory.getDonation(1);
      expect(donation1Record.donorNumber).to.equal(1);
      expect(donation2Record.donorNumber).to.equal(2);
    });

    it("Should reject donations to inactive campaigns", async function () {
      // Complete the campaign first
      await campaignFactory.connect(donor1).donate(campaignId, "uri", {
        value: goalAmount
      });

      // Try to donate to completed campaign
      await expect(
        campaignFactory.connect(donor2).donate(campaignId, "uri2", {
          value: ethers.parseEther("0.1")
        })
      ).to.be.revertedWith("Campaign is not active");
    });

    it("Should reject zero donations", async function () {
      await expect(
        campaignFactory.connect(donor1).donate(campaignId, "uri", { value: 0 })
      ).to.be.revertedWith("Donation amount must be greater than 0");
    });

    it("Should reject donations that are too large", async function () {
      await expect(
        campaignFactory.connect(donor1).donate(campaignId, "uri", { 
          value: ethers.parseEther("101") // Over 100 ETH limit
        })
      ).to.be.revertedWith("Donation amount too large");
    });

    it("Should reject donations with empty token URI", async function () {
      await expect(
        campaignFactory.connect(donor1).donate(campaignId, "", { 
          value: ethers.parseEther("0.1")
        })
      ).to.be.revertedWith("Token URI cannot be empty");
    });

    it("Should reject donations with token URI too long", async function () {
      const longUri = "https://example.com/" + "a".repeat(500); // Over 500 char limit
      await expect(
        campaignFactory.connect(donor1).donate(campaignId, longUri, { 
          value: ethers.parseEther("0.1")
        })
      ).to.be.revertedWith("Token URI too long");
    });
  });

  describe("Campaign Queries", function () {
    beforeEach(async function () {
      // Create multiple campaigns
      await campaignFactory.connect(creator).createCampaign(
        "Campaign 1",
        "Description 1",
        "image1",
        ethers.parseEther("1.0"),
        recipient.address
      );

      await campaignFactory.connect(creator).createCampaign(
        "Campaign 2",
        "Description 2",
        "image2",
        ethers.parseEther("2.0"),
        recipient.address
      );

      // Complete first campaign
      await campaignFactory.connect(donor1).donate(0, "uri", {
        value: ethers.parseEther("1.0")
      });
    });

    it("Should return active campaigns only", async function () {
      const activeCampaigns = await campaignFactory.getActiveCampaigns();
      expect(activeCampaigns.length).to.equal(1);
      expect(activeCampaigns[0].title).to.equal("Campaign 2");
    });

    it("Should return total campaigns count", async function () {
      expect(await campaignFactory.getTotalCampaigns()).to.equal(2);
    });

    it("Should return total NFTs count", async function () {
      expect(await campaignFactory.getTotalNFTs()).to.equal(1);
    });

    it("Should return user campaigns", async function () {
      const userCampaigns = await campaignFactory.getUserCampaigns(creator.address);
      expect(userCampaigns.length).to.equal(2);
      expect(userCampaigns[0]).to.equal(0);
      expect(userCampaigns[1]).to.equal(1);
    });

    it("Should return user donations", async function () {
      const userDonations = await campaignFactory.getUserDonations(donor1.address);
      expect(userDonations.length).to.equal(1);
      expect(userDonations[0]).to.equal(0);
    });
  });

  describe("Leaderboard", function () {
    let campaignId;

    beforeEach(async function () {
      await campaignFactory.connect(creator).createCampaign(
        "Test Campaign",
        "Test Description",
        "image",
        ethers.parseEther("10.0"),
        recipient.address
      );
      campaignId = 0;

      // Make donations of different amounts
      await campaignFactory.connect(donor1).donate(campaignId, "uri1", {
        value: ethers.parseEther("1.0")
      });

      await campaignFactory.connect(donor2).donate(campaignId, "uri2", {
        value: ethers.parseEther("2.0")
      });
    });

    it("Should return leaderboard sorted by donation amount", async function () {
      const [donors, amounts, timestamps] = await campaignFactory.getCampaignLeaderboard(campaignId, 10);
      
      expect(donors.length).to.equal(2);
      expect(donors[0]).to.equal(donor2.address); // Highest donor first
      expect(donors[1]).to.equal(donor1.address);
      expect(amounts[0]).to.equal(ethers.parseEther("2.0"));
      expect(amounts[1]).to.equal(ethers.parseEther("1.0"));
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to pause campaigns", async function () {
      await campaignFactory.connect(creator).createCampaign(
        "Test Campaign",
        "Test Description",
        "image",
        ethers.parseEther("1.0"),
        recipient.address
      );

      await campaignFactory.connect(owner).pauseCampaign(0);
      
      const campaign = await campaignFactory.getCampaign(0);
      expect(campaign.isActive).to.be.false;
    });

    it("Should reject non-owner pause attempts", async function () {
      await campaignFactory.connect(creator).createCampaign(
        "Test Campaign",
        "Test Description",
        "image",
        ethers.parseEther("1.0"),
        recipient.address
      );

      await expect(
        campaignFactory.connect(creator).pauseCampaign(0)
      ).to.be.revertedWithCustomError(campaignFactory, "OwnableUnauthorizedAccount");
    });
  });
}); 