// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract CampaignFactory is ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _campaignIdCounter;
    
    struct Campaign {
        uint256 id;
        string title;
        string description;
        string imageUri;
        uint256 goalAmount;
        uint256 raisedAmount;
        address payable creator;
        address payable recipient;
        bool isActive;
        uint256 createdAt;
        uint256 totalDonors;
    }
    
    struct Donation {
        uint256 campaignId;
        address donor;
        uint256 amount;
        uint256 timestamp;
        uint256 tokenId;
        uint256 donorNumber; // 1 of X
    }
    
    // Mappings
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => Donation) public donations; // tokenId => donation
    mapping(uint256 => uint256[]) public campaignDonations; // campaignId => tokenIds[]
    mapping(address => uint256[]) public userCampaigns; // creator => campaignIds[]
    mapping(address => uint256[]) public userDonations; // donor => tokenIds[]
    
    // Events
    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed creator,
        address indexed recipient,
        string title,
        uint256 goalAmount
    );
    
    event DonationMade(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount,
        uint256 indexed tokenId,
        uint256 donorNumber,
        uint256 totalDonors
    );
    
    event CampaignCompleted(uint256 indexed campaignId, uint256 totalRaised);
    
    constructor() ERC721("GoNFTme Donation", "GNFT") {}
    
    /**
     * Create a new crowdfunding campaign
     */
    function createCampaign(
        string memory _title,
        string memory _description,
        string memory _imageUri,
        uint256 _goalAmount,
        address payable _recipient
    ) external returns (uint256) {
        require(_goalAmount > 0, "Goal amount must be greater than 0");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_recipient != address(0), "Recipient cannot be zero address");
        
        uint256 campaignId = _campaignIdCounter.current();
        _campaignIdCounter.increment();
        
        campaigns[campaignId] = Campaign({
            id: campaignId,
            title: _title,
            description: _description,
            imageUri: _imageUri,
            goalAmount: _goalAmount,
            raisedAmount: 0,
            creator: payable(msg.sender),
            recipient: _recipient,
            isActive: true,
            createdAt: block.timestamp,
            totalDonors: 0
        });
        
        userCampaigns[msg.sender].push(campaignId);
        
        emit CampaignCreated(campaignId, msg.sender, _recipient, _title, _goalAmount);
        
        return campaignId;
    }
    
    /**
     * Make a donation to a campaign and mint an NFT
     */
    function donate(uint256 _campaignId, string memory _tokenUri) external payable nonReentrant {
        require(msg.value > 0, "Donation amount must be greater than 0");
        require(_campaignId < _campaignIdCounter.current(), "Campaign does not exist");
        
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.isActive, "Campaign is not active");
        require(campaign.raisedAmount < campaign.goalAmount, "Campaign goal already reached");
        
        // Calculate donation amount (don't exceed goal)
        uint256 donationAmount = msg.value;
        uint256 remainingAmount = campaign.goalAmount - campaign.raisedAmount;
        
        if (donationAmount > remainingAmount) {
            donationAmount = remainingAmount;
            // Refund excess
            payable(msg.sender).transfer(msg.value - donationAmount);
        }
        
        // Update campaign
        campaign.raisedAmount += donationAmount;
        campaign.totalDonors += 1;
        
        // Transfer funds to recipient
        campaign.recipient.transfer(donationAmount);
        
        // Mint NFT
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenUri);
        
        // Record donation
        donations[tokenId] = Donation({
            campaignId: _campaignId,
            donor: msg.sender,
            amount: donationAmount,
            timestamp: block.timestamp,
            tokenId: tokenId,
            donorNumber: campaign.totalDonors
        });
        
        campaignDonations[_campaignId].push(tokenId);
        userDonations[msg.sender].push(tokenId);
        
        emit DonationMade(_campaignId, msg.sender, donationAmount, tokenId, campaign.totalDonors, campaign.totalDonors);
        
        // Check if goal is reached
        if (campaign.raisedAmount >= campaign.goalAmount) {
            campaign.isActive = false;
            emit CampaignCompleted(_campaignId, campaign.raisedAmount);
        }
    }
    
    /**
     * Get campaign details
     */
    function getCampaign(uint256 _campaignId) external view returns (Campaign memory) {
        require(_campaignId < _campaignIdCounter.current(), "Campaign does not exist");
        return campaigns[_campaignId];
    }
    
    /**
     * Get all active campaigns
     */
    function getActiveCampaigns() external view returns (Campaign[] memory) {
        uint256 totalCampaigns = _campaignIdCounter.current();
        uint256 activeCount = 0;
        
        // Count active campaigns
        for (uint256 i = 0; i < totalCampaigns; i++) {
            if (campaigns[i].isActive) {
                activeCount++;
            }
        }
        
        // Create array of active campaigns
        Campaign[] memory activeCampaigns = new Campaign[](activeCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < totalCampaigns; i++) {
            if (campaigns[i].isActive) {
                activeCampaigns[currentIndex] = campaigns[i];
                currentIndex++;
            }
        }
        
        return activeCampaigns;
    }
    
    /**
     * Get campaigns created by a user
     */
    function getUserCampaigns(address _user) external view returns (uint256[] memory) {
        return userCampaigns[_user];
    }
    
    /**
     * Get donations made by a user
     */
    function getUserDonations(address _user) external view returns (uint256[] memory) {
        return userDonations[_user];
    }
    
    /**
     * Get campaign donations (token IDs)
     */
    function getCampaignDonations(uint256 _campaignId) external view returns (uint256[] memory) {
        return campaignDonations[_campaignId];
    }
    
    /**
     * Get donation details by token ID
     */
    function getDonation(uint256 _tokenId) external view returns (Donation memory) {
        require(_exists(_tokenId), "Token does not exist");
        return donations[_tokenId];
    }
    
    /**
     * Get total number of campaigns
     */
    function getTotalCampaigns() external view returns (uint256) {
        return _campaignIdCounter.current();
    }
    
    /**
     * Get total number of NFTs minted
     */
    function getTotalNFTs() external view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    /**
     * Emergency pause function (only owner)
     */
    function pauseCampaign(uint256 _campaignId) external onlyOwner {
        require(_campaignId < _campaignIdCounter.current(), "Campaign does not exist");
        campaigns[_campaignId].isActive = false;
    }
    
    /**
     * Get leaderboard for a campaign (top donors)
     */
    function getCampaignLeaderboard(uint256 _campaignId, uint256 _limit) external view returns (
        address[] memory donors,
        uint256[] memory amounts,
        uint256[] memory timestamps
    ) {
        uint256[] memory tokenIds = campaignDonations[_campaignId];
        uint256 length = tokenIds.length > _limit ? _limit : tokenIds.length;
        
        donors = new address[](length);
        amounts = new uint256[](length);
        timestamps = new uint256[](length);
        
        // Simple sorting by amount (descending) - for production, consider off-chain sorting
        uint256[] memory sortedIndices = new uint256[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            sortedIndices[i] = i;
        }
        
        // Bubble sort by donation amount (simple for now)
        for (uint256 i = 0; i < tokenIds.length; i++) {
            for (uint256 j = i + 1; j < tokenIds.length; j++) {
                if (donations[tokenIds[sortedIndices[i]]].amount < donations[tokenIds[sortedIndices[j]]].amount) {
                    uint256 temp = sortedIndices[i];
                    sortedIndices[i] = sortedIndices[j];
                    sortedIndices[j] = temp;
                }
            }
        }
        
        for (uint256 i = 0; i < length; i++) {
            uint256 tokenId = tokenIds[sortedIndices[i]];
            Donation memory donation = donations[tokenId];
            donors[i] = donation.donor;
            amounts[i] = donation.amount;
            timestamps[i] = donation.timestamp;
        }
        
        return (donors, amounts, timestamps);
    }
} 