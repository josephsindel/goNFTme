import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { World } from '../support/world'

// Navigation steps
Given('I am on the homepage', async function (this: World) {
  await this.page.goto('/')
  await this.page.waitForLoadState('networkidle')
})

Given('I am on the campaign creation page {string}', async function (this: World, path: string) {
  await this.page.goto(path)
  await this.page.waitForLoadState('networkidle')
})

Given('I am not connected to a wallet', async function (this: World) {
  // For now, we'll assume no wallet is connected by default
  // In the future, we might need to mock wallet disconnection
})

// UI Verification steps
Then('I should see the {string} logo with stylized animation', async function (this: World, logoText: string) {
  const logo = this.page.locator('.logo-text', { hasText: logoText })
  await expect(logo).toBeVisible()
  
  // Check for animation classes
  await expect(logo).toHaveClass(/logo-text/)
  
  // Check for sparkle element
  const sparkle = this.page.locator('.logo-sparkle')
  await expect(sparkle).toBeVisible()
})

Then('I should see the tagline {string}', async function (this: World, tagline: string) {
  await expect(this.page.locator('text=' + tagline)).toBeVisible()
})

Then('I should see the hero section with {string}', async function (this: World, heroText: string) {
  await expect(this.page.locator('h1', { hasText: heroText })).toBeVisible()
})

// Click actions
When('I click the {string} button', async function (this: World, buttonText: string) {
  await this.page.locator('button', { hasText: buttonText }).click()
})

When('I click the {string} link', async function (this: World, linkText: string) {
  await this.page.locator('a', { hasText: linkText }).click()
})

// Scroll and feature verification
Then('the page should scroll to the features section', async function (this: World) {
  // Wait for scroll animation to complete
  await this.page.waitForTimeout(1000)
  
  // Check if features section is in viewport
  const featuresSection = this.page.locator('.grid.sm\\:grid-cols-2.lg\\:grid-cols-3')
  await expect(featuresSection).toBeInViewport()
})

Then('I should see the {string} feature card', async function (this: World, featureTitle: string) {
  await expect(this.page.locator('h3', { hasText: featureTitle })).toBeVisible()
})

// Hover and cursor checks
When('I hover over the {string} feature card', async function (this: World, featureTitle: string) {
  const featureCard = this.page.locator('h3', { hasText: featureTitle }).locator('..')
  await featureCard.hover()
})

Then('it should not have a clickable cursor', async function (this: World) {
  // This is a bit tricky to test directly, but we can check for absence of click handlers
  const featureCard = this.page.locator('.text-center.p-6.rounded-xl').first()
  
  // Check that it doesn't have click event listeners (this is approximate)
  const hasClickHandler = await featureCard.evaluate((el) => {
    return el.onclick !== null || el.getAttribute('onclick') !== null
  })
  
  expect(hasClickHandler).toBeFalsy()
})

Then('it should not have hover shadow effects', async function (this: World) {
  const featureCard = this.page.locator('.text-center.p-6.rounded-xl').first()
  
  // Check that hover:shadow-lg class is not present
  const classes = await featureCard.getAttribute('class')
  expect(classes).not.toContain('hover:shadow-lg')
})

// Navigation verification
Then('I should be redirected to the {string} page', async function (this: World, path: string) {
  await this.page.waitForURL(`**${path}`)
  expect(this.page.url()).toContain(path)
})

Then('I should see the campaign creation form', async function (this: World) {
  await expect(this.page.locator('form')).toBeVisible()
  await expect(this.page.locator('input[name="title"]')).toBeVisible()
  await expect(this.page.locator('textarea[name="description"]')).toBeVisible()
  await expect(this.page.locator('input[name="goalAmount"]')).toBeVisible()
})

Then('I should see a {string} message', async function (this: World, message: string) {
  await expect(this.page.locator('text=' + message)).toBeVisible()
})

Then('I should not see the campaign creation form', async function (this: World) {
  await expect(this.page.locator('form')).not.toBeVisible()
})

Then('I should be redirected to the homepage', async function (this: World) {
  await this.page.waitForURL('**/')
  expect(this.page.url()).toMatch(/\/$/)
})
