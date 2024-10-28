import { test, expect } from '@playwright/test'

test.describe('Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('complete booking flow', async ({ page }) => {
    // Login
    await page.click('text=Sign In')
    await page.click('text=Continue with Google')
    
    // Select expert
    await page.click('text=Find an Expert')
    await page.click('text=John Doe')
    
    // Select time slot
    await page.click('text=Book a Session')
    await page.click('text=09:00 AM')
    
    // Confirm booking
    await page.click('text=Confirm Booking')
    
    // Verify success message
    await expect(page.locator('text=Booking Confirmed')).toBeVisible()
    
    // Check booking in dashboard
    await page.click('text=My Bookings')
    await expect(page.locator('text=John Doe')).toBeVisible()
    await expect(page.locator('text=09:00 AM')).toBeVisible()
  })
})