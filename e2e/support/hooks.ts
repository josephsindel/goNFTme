import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber'
import { Browser, Page, chromium } from '@playwright/test'
import { World } from './world'

let browser: Browser
let page: Page

BeforeAll(async function () {
  // Launch browser once for all tests
  browser = await chromium.launch({ 
    headless: process.env.CI === 'true',
    slowMo: process.env.CI ? 0 : 100 // Add slight delay for debugging
  })
})

Before(async function (this: World) {
  // Create a new page for each scenario
  page = await browser.newPage()
  
  // Set viewport for consistent testing
  await page.setViewportSize({ width: 1280, height: 720 })
  
  // Attach page to world context
  this.page = page
  
  // Set up console logging for debugging
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.error(`Browser Console Error: ${msg.text()}`)
    }
  })
  
  // Set up error handling
  page.on('pageerror', (error) => {
    console.error(`Page Error: ${error.message}`)
  })
})

After(async function (this: World) {
  // Close the page after each scenario
  if (page) {
    await page.close()
  }
})

AfterAll(async function () {
  // Close browser after all tests
  if (browser) {
    await browser.close()
  }
})
