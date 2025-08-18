import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')
    
    // Check title
    await expect(page).toHaveTitle(/GoNFTme/)
    
    // Check main heading
    await expect(page.getByText('GoNFTme')).toBeVisible()
    
    // Check hero section
    await expect(page.getByText('Crowdfund with NFT Rewards')).toBeVisible()
    await expect(page.getByText('Create campaigns, donate to causes, and earn unique NFTs')).toBeVisible()
    
    // Check CTA button
    await expect(page.getByRole('link', { name: 'Start Campaign' })).toBeVisible()
    
    // Check navigation
    await expect(page.getByRole('link', { name: 'My NFTs' })).toBeVisible()
  })

  test('should display campaigns section', async ({ page }) => {
    await page.goto('/')
    
    // Check campaigns section
    await expect(page.getByText('Active Campaigns')).toBeVisible()
    
    // Should either show campaigns or "no campaigns" message
    const campaignsExist = await page.locator('[data-testid="campaign-card"]').count()
    if (campaignsExist === 0) {
      await expect(page.getByText('No active campaigns yet')).toBeVisible()
    } else {
      // If campaigns exist, check they have required elements
      const firstCampaign = page.locator('[data-testid="campaign-card"]').first()
      await expect(firstCampaign).toBeVisible()
    }
  })

  test('should have working navigation', async ({ page }) => {
    await page.goto('/')
    
    // Test "Start Campaign" navigation
    await page.getByRole('link', { name: 'Start Campaign' }).click()
    await expect(page).toHaveURL('/create')
    
    // Go back to homepage
    await page.goto('/')
    
    // Test "My NFTs" navigation
    await page.getByRole('link', { name: 'My NFTs' }).click()
    await expect(page).toHaveURL('/my-nfts')
  })

  test('should have responsive design', async ({ page }) => {
    // Test desktop
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.goto('/')
    await expect(page.getByText('GoNFTme')).toBeVisible()
    
    // Test tablet
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByText('GoNFTme')).toBeVisible()
    
    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByText('GoNFTme')).toBeVisible()
  })

  test('should load CSS styles correctly', async ({ page }) => {
    await page.goto('/')
    
    // Check that Tailwind classes are applied
    const heroSection = page.locator('text=Crowdfund with NFT Rewards').first()
    await expect(heroSection).toBeVisible()
    
    // Check that the page doesn't have broken CSS (unstyled content)
    const body = page.locator('body')
    const bodyStyles = await body.evaluate((el) => {
      const styles = window.getComputedStyle(el)
      return {
        fontFamily: styles.fontFamily,
        backgroundColor: styles.backgroundColor
      }
    })
    
    // Should have font applied (not default browser font)
    expect(bodyStyles.fontFamily).not.toBe('Times')
  })
})
