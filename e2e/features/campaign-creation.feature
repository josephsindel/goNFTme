Feature: Campaign Creation Form
  As a user who wants to create a crowdfunding campaign
  I want to fill out a campaign creation form
  So that I can launch my campaign and receive donations

  Background:
    Given I am on the campaign creation page "/create"

  Scenario: Form fields accept input including spaces
    When I enter "Help me pay my mortgage" in the title field
    And I enter "This is a test description with spaces" in the description field
    And I enter "1.5" in the goal amount field
    Then the title field should contain "Help me pay my mortgage"
    And the description field should contain "This is a test description with spaces"
    And the goal amount field should contain "1.5"

  Scenario: Spacebar works correctly in text inputs
    When I focus on the title field
    And I type "Help" and press spacebar and type "me"
    Then the title field should contain "Help me"
    When I focus on the description field
    And I type "This" and press spacebar and type "works"
    Then the description field should contain "This works"

  Scenario: Form validation works correctly
    When I click the "Create Campaign" button without filling the form
    Then I should see validation error messages
    And the form should not be submitted

  Scenario: Image upload functionality
    When I upload a valid image file
    Then I should see an image preview
    And I should be able to change the image

  Scenario: Wallet connection requirement
    Given I am not connected to a wallet
    When I visit the campaign creation page
    Then I should see a "Connect Your Wallet" message
    And I should not see the campaign creation form

  Scenario: Back navigation works
    When I click the "Back to Home" link
    Then I should be redirected to the homepage
