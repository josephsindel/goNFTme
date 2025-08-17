import { When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { World } from '../support/world'

// Form input steps
When('I enter {string} in the title field', async function (this: World, text: string) {
  await this.page.locator('input[name="title"]').fill(text)
})

When('I enter {string} in the description field', async function (this: World, text: string) {
  await this.page.locator('textarea[name="description"]').fill(text)
})

When('I enter {string} in the goal amount field', async function (this: World, amount: string) {
  await this.page.locator('input[name="goalAmount"]').fill(amount)
})

// Form field verification
Then('the title field should contain {string}', async function (this: World, expectedText: string) {
  const titleField = this.page.locator('input[name="title"]')
  await expect(titleField).toHaveValue(expectedText)
})

Then('the description field should contain {string}', async function (this: World, expectedText: string) {
  const descriptionField = this.page.locator('textarea[name="description"]')
  await expect(descriptionField).toHaveValue(expectedText)
})

Then('the goal amount field should contain {string}', async function (this: World, expectedAmount: string) {
  const goalField = this.page.locator('input[name="goalAmount"]')
  await expect(goalField).toHaveValue(expectedAmount)
})

// Spacebar testing
When('I focus on the title field', async function (this: World) {
  await this.page.locator('input[name="title"]').focus()
})

When('I focus on the description field', async function (this: World) {
  await this.page.locator('textarea[name="description"]').focus()
})

When('I type {string} and press spacebar and type {string}', async function (this: World, firstWord: string, secondWord: string) {
  // Clear the field first
  await this.page.keyboard.press('Control+A')
  await this.page.keyboard.press('Delete')
  
  // Type first word
  await this.page.keyboard.type(firstWord)
  
  // Press spacebar
  await this.page.keyboard.press('Space')
  
  // Type second word
  await this.page.keyboard.type(secondWord)
})

// Form validation
Then('I should see validation error messages', async function (this: World) {
  // Wait for any toast notifications or error messages
  await this.page.waitForTimeout(1000)
  
  // Look for common validation error patterns
  const errorSelectors = [
    'text=Title is required',
    'text=Description is required', 
    'text=Goal amount must be greater than 0',
    'text=Please upload a campaign image',
    'text=Please connect your wallet first'
  ]
  
  let errorFound = false
  for (const selector of errorSelectors) {
    if (await this.page.locator(selector).isVisible()) {
      errorFound = true
      break
    }
  }
  
  expect(errorFound).toBeTruthy()
})

Then('the form should not be submitted', async function (this: World) {
  // Verify we're still on the create page
  expect(this.page.url()).toContain('/create')
  
  // Verify form is still visible
  await expect(this.page.locator('form')).toBeVisible()
})

// Image upload
When('I upload a valid image file', async function (this: World) {
  // Create a simple test image data URL
  const testImageDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
  
  // For testing purposes, we'll mock the file input
  // In a real scenario, you'd use page.setInputFiles()
  await this.page.locator('input[type="file"]').setInputFiles({
    name: 'test-image.png',
    mimeType: 'image/png',
    buffer: Buffer.from(testImageDataUrl.split(',')[1], 'base64')
  })
})

Then('I should see an image preview', async function (this: World) {
  // Look for image preview element
  await expect(this.page.locator('img[alt="Preview"]')).toBeVisible()
})

Then('I should be able to change the image', async function (this: World) {
  // Look for change image button
  await expect(this.page.locator('button', { hasText: 'Change Image' })).toBeVisible()
})
