import { test, expect } from '@playwright/test'

const useRealApi = process.env.PLAYWRIGHT_USE_REAL_API === 'true'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:5173',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
}

test.describe('E2E Flow 4: Authorization Protection', () => {
  test('Unauthenticated user navigating to protected admin route is redirected to login', async ({ page }) => {
    if (!useRealApi) {
      // Mock unauthenticated auth me check for isolated testing mode
      await page.route(/\/api\/v1\/auth\/me/, async (route) => {
        if (route.request().method() === 'OPTIONS') {
          await route.fulfill({ status: 200, headers: corsHeaders })
          return
        }
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          headers: corsHeaders,
          body: JSON.stringify({ message: 'Unauthenticated' }),
        })
      })
    }

    // Attempt direct navigation to protected admin projects route
    await page.goto('/admin/projects')

    // Should redirect to login route (/login)
    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole('heading', { name: 'Admin Portal' })).toBeVisible()
  })
})
