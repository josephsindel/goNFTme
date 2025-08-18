import { test, expect } from '@playwright/test'

test.describe('GoNFTme E2E Functionality Test', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the homepage
    await page.goto('/')
  })

  test('Homepage loads correctly', async ({ page }) => {
    // Check that the page loads
    await expect(page).toHaveTitle(/GoNFTme/)
    
    // Check main heading (there might be multiple, so use first)
    await expect(page.locator('h1, h2, h3').filter({ hasText: 'GoNFTme' }).first()).toBeVisible()
    
    // Check hero section
    await expect(page.getByText('Crowdfund with NFT Rewards')).toBeVisible()
    
    // Check main call-to-action
    await expect(page.getByRole('link', { name: 'Start a Campaign' })).toBeVisible()
  })

  test('Create campaign page loads', async ({ page }) => {
    // Navigate to create campaign page
    await page.click('text=Start a Campaign')
    
    // Check that we're on the create page
    await expect(page).toHaveURL(/.*\/create/)
    
    // Check form elements are present
    await expect(page.getByPlaceholder('Enter your campaign title')).toBeVisible()
    await expect(page.getByPlaceholder('Describe your campaign')).toBeVisible()
    await expect(page.getByText('Goal Amount')).toBeVisible()
  })

  test('Form validation works', async ({ page }) => {
    // Go to create page
    await page.goto('/create')
    
    // Try to submit empty form
    await page.click('button[type="submit"]')
    
    // Should show validation error (wallet connection required)
    await expect(page.getByText('Please connect your wallet first')).toBeVisible()
  })

  test('Navigation works correctly', async ({ page }) => {
    // Test navigation to different pages
    await page.goto('/create')
    
    // Go back to home
    await page.click('text=Back to Home')
    await expect(page).toHaveURL('/')
    
    // Check that homepage content is visible
    await expect(page.getByText('Crowdfund with NFT Rewards')).toBeVisible()
  })

  test('Admin authentication flow', async ({ page }) => {
    // Try to access admin page directly
    await page.goto('/admin')
    
    // Should redirect to signin or show signin prompt
    const isSigninPage = await page.locator('text=Sign in').isVisible()
    const isConnectWallet = await page.locator('text=Connect Your Wallet').isVisible()
    
    expect(isSigninPage || isConnectWallet).toBe(true)
  })

  test('Security dashboard requires authentication', async ({ page }) => {
    // Try to access security dashboard directly
    await page.goto('/admin/security')
    
    // Should redirect to signin
    await expect(page).toHaveURL(/.*\/auth\/signin/)
  })

  test('Page responsiveness', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Check that content is still visible on mobile
    await expect(page.locator('h1, h2, h3').filter({ hasText: 'GoNFTme' }).first()).toBeVisible()
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 })
    await expect(page.locator('h1, h2, h3').filter({ hasText: 'GoNFTme' }).first()).toBeVisible()
  })

  test('Error handling', async ({ page }) => {
    // Test 404 page
    await page.goto('/non-existent-page')
    
    // Should show 404 error
    const is404 = await page.locator('text=404').isVisible() || 
                   await page.locator('text=Page not found').isVisible() ||
                   await page.locator('text=This page could not be found').isVisible()
    
    expect(is404).toBe(true)
  })

  test('CSS and styling loads correctly', async ({ page }) => {
    await page.goto('/')
    
    // Check that Tailwind CSS classes are applied
    const heroSection = page.locator('text=Crowdfund with NFT Rewards').first()
    await expect(heroSection).toBeVisible()
    
    // Check that buttons have proper styling
    const startButton = page.getByRole('link', { name: 'Start a Campaign' })
    await expect(startButton).toBeVisible()
    
    // Check that the button has some background color (indicating CSS is loaded)
    const buttonStyles = await startButton.evaluate(el => getComputedStyle(el))
    expect(buttonStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
  })

  test('Security features', async ({ page }) => {
    // Check that the admin π button is present (security feature)
    const piButton = page.locator('text=π')
    await expect(piButton).toBeVisible()
    
    // Check that clicking it goes to auth
    await piButton.click()
    await expect(page).toHaveURL(/.*\/auth\/signin/)
  })

  test('Form input validation', async ({ page }) => {
    await page.goto('/create')
    
    // Test that form inputs work (no spacebar issue)
    const titleInput = page.getByPlaceholder('Enter your campaign title')
    await titleInput.fill('Test Campaign With Spaces')
    
    const value = await titleInput.inputValue()
    expect(value).toBe('Test Campaign With Spaces')
    
    // Test description textarea
    const descInput = page.getByPlaceholder('Describe your campaign')
    await descInput.fill('This is a test description with spaces and special chars: @#$%')
    
    const descValue = await descInput.inputValue()
    expect(descValue).toContain('spaces')
  })
})
