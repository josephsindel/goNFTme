Feature: Homepage Navigation and UI
  As a user visiting GoNFTme
  I want to navigate the homepage and interact with UI elements
  So that I can understand the platform and create campaigns

  Background:
    Given I am on the homepage

  Scenario: Homepage loads with correct branding
    Then I should see the "GoNFTme" logo with stylized animation
    And I should see the tagline "Web3 Crowdfunding"
    And I should see the hero section with "Crowdfunding with NFT Rewards"

  Scenario: Learn More button scrolls to features
    When I click the "Learn More" button
    Then the page should scroll to the features section
    And I should see the "Set Your Goal" feature card
    And I should see the "NFT Rewards" feature card
    And I should see the "Instant Funding" feature card

  Scenario: Feature cards are not clickable
    When I hover over the "Set Your Goal" feature card
    Then it should not have a clickable cursor
    And it should not have hover shadow effects

  Scenario: Navigation to campaign creation
    When I click the "Start Your Campaign" button
    Then I should be redirected to the "/create" page
    And I should see the campaign creation form

  Scenario: Create Campaign button in header
    When I click the "Create Campaign" button in the header
    Then I should be redirected to the "/create" page
