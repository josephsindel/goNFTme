import { test, expect } from '@playwright/test'

test.describe('GoNFTme Basic Functionality', () => {
  test('homepage loads and displays correct branding', async ({ page }) => {
    await page.goto('/')
    
    // Check for stylized logo in header (first occurrence)
    await expect(page.locator('.logo-sparkle .logo-text').first()).toBeVisible()
    await expect(page.locator('.logo-sparkle')).toBeVisible()
    
    // Check main heading
    await expect(page.locator('h1', { hasText: 'Crowdfunding with' })).toBeVisible()
    await expect(page.locator('h1 .logo-text', { hasText: 'NFT Rewards' })).toBeVisible()
  })

  test('Learn More button scrolls to features', async ({ page }) => {
    await page.goto('/')
    
    // Click Learn More button
    await page.locator('button', { hasText: 'Learn More' }).click()
    
    // Wait for scroll animation
    await page.waitForTimeout(1000)
    
    // Check if features section is in viewport
    const featuresSection = page.locator('.grid.sm\\:grid-cols-2.lg\\:grid-cols-3')
    await expect(featuresSection).toBeInViewport()
  })

  test('feature cards do not have hover shadow effects', async ({ page }) => {
    await page.goto('/')
    
    // Check that feature cards don't have hover:shadow-lg class
    const featureCards = page.locator('.text-center.p-6.rounded-xl')
    const firstCard = featureCards.first()
    
    const classes = await firstCard.getAttribute('class')
    expect(classes).not.toContain('hover:shadow-lg')
  })

  test('navigation to campaign creation works', async ({ page }) => {
    await page.goto('/')
    
    // Click Start Your Campaign button
    await page.locator('a', { hasText: 'Start Your Campaign' }).click()
    
    // Should navigate to create page
    await expect(page).toHaveURL(/\/create$/)
  })

  test('campaign form accepts input including spaces', async ({ page }) => {
    await page.goto('/create')
    
    // Wait for form to load (might show wallet connect first)
    await page.waitForLoadState('networkidle')
    
    // Check if we need to connect wallet or if form is visible
    const formVisible = await page.locator('form').isVisible()
    const walletConnectVisible = await page.locator('text=Connect Your Wallet').isVisible()
    
    if (walletConnectVisible && !formVisible) {
      // Skip this test if wallet connection is required
      test.skip('Wallet connection required for this test')
    }
    
    // Test title field with spaces
    const titleField = page.locator('input[name="title"]')
    await titleField.fill('Help me pay my mortgage')
    await expect(titleField).toHaveValue('Help me pay my mortgage')
    
    // Test description field with spaces
    const descriptionField = page.locator('textarea[name="description"]')
    await descriptionField.fill('This is a test description with spaces')
    await expect(descriptionField).toHaveValue('This is a test description with spaces')
    
    // Test goal amount field
    const goalField = page.locator('input[name="goalAmount"]')
    await goalField.fill('1.5')
    await expect(goalField).toHaveValue('1.5')
  })

  test('spacebar works correctly in form fields', async ({ page }) => {
    await page.goto('/create')
    
    // Wait for form to load
    await page.waitForLoadState('networkidle')
    
    // Check if wallet connection is required
    const formVisible = await page.locator('form').isVisible()
    const walletConnectVisible = await page.locator('text=Connect Your Wallet').isVisible()
    
    if (walletConnectVisible && !formVisible) {
      test.skip('Wallet connection required for this test')
    }
    
    // Test spacebar in title field
    const titleField = page.locator('input[name="title"]')
    await titleField.focus()
    await page.keyboard.type('Help')
    await page.keyboard.press('Space')
    await page.keyboard.type('me')
    await expect(titleField).toHaveValue('Help me')
    
    // Test spacebar in description field
    const descriptionField = page.locator('textarea[name="description"]')
    await descriptionField.focus()
    await page.keyboard.press('Control+A') // Clear field
    await page.keyboard.type('This')
    await page.keyboard.press('Space')
    await page.keyboard.type('works')
    await expect(descriptionField).toHaveValue('This works')
  })

  test('back navigation works from create page', async ({ page }) => {
    await page.goto('/create')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Look for back link - it should be visible regardless of wallet connection
    const backLink = page.locator('a', { hasText: 'Back to Home' })
    await expect(backLink).toBeVisible()
    
    // Click back to home link
    await backLink.click()
    
    // Should navigate back to homepage
    await expect(page).toHaveURL(/\/$/)
  })
})
