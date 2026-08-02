import { test, expect } from '@playwright/test'

const useRealApi = process.env.PLAYWRIGHT_USE_REAL_API === 'true'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:5173',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
}

const mockUser = {
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  email: 'admin@example.com',
  role: 'ADMIN',
  username: 'admin',
  firstName: 'System',
  lastName: 'Admin',
}

test.describe('E2E Flow 1: Authentication', () => {
  test('Login -> Admin Dashboard -> Logout journey', async ({ page }) => {
    if (!useRealApi) {
      // Mock auth endpoints for fast isolated testing mode
      await page.route(/\/api\/v1\/auth\/login/, async (route) => {
        if (route.request().method() === 'OPTIONS') {
          await route.fulfill({ status: 200, headers: corsHeaders })
          return
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          headers: corsHeaders,
          body: JSON.stringify(mockUser),
        })
      })

      await page.route(/\/api\/v1\/auth\/me/, async (route) => {
        if (route.request().method() === 'OPTIONS') {
          await route.fulfill({ status: 200, headers: corsHeaders })
          return
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          headers: corsHeaders,
          body: JSON.stringify(mockUser),
        })
      })

      await page.route(/\/api\/v1\/auth\/logout/, async (route) => {
        if (route.request().method() === 'OPTIONS') {
          await route.fulfill({ status: 200, headers: corsHeaders })
          return
        }
        await route.fulfill({
          status: 200,
          headers: corsHeaders,
        })
      })
    }

    // Navigate to Login Page
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'Admin Portal' })).toBeVisible()

    // Fill login credentials
    await page.getByLabel('Email Address').fill('admin@example.com')
    await page.getByLabel('Password').fill('Admin@123456')

    // Click Sign In
    await page.getByRole('button', { name: 'Sign In' }).click()

    // Navigate to Admin Dashboard
    await page.goto('/admin')
    await expect(page.getByText(/Welcome back/i)).toBeVisible()

    // Logout
    const logoutBtn = page.getByRole('button', { name: /Sign Out|Logout/i })
    await expect(logoutBtn).toBeVisible()
    await logoutBtn.click()
  })
})
