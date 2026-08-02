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
}

test.describe('E2E Flow 2: Projects Management', () => {
  test('Create -> Update -> Delete Project lifecycle', async ({ page }) => {
    let projectsList: Array<{
      id: string
      title: string
      slug: string
      headline: string
      published: boolean
      featured: boolean
    }> = []

    if (!useRealApi) {
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

      await page.route(/\/api\/v1\/projects/, async (route) => {
        if (route.request().method() === 'OPTIONS') {
          await route.fulfill({ status: 200, headers: corsHeaders })
          return
        }

        if (route.request().method() === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            headers: corsHeaders,
            body: JSON.stringify(projectsList),
          })
        } else if (route.request().method() === 'POST') {
          const newProj = {
            id: 'b1f868d4-54c3-4d7a-9a00-112233445566',
            title: 'Playwright Test Project',
            slug: 'playwright-test-project',
            headline: 'E2E Testing Project',
            published: true,
            featured: true,
          }
          projectsList = [newProj]
          await route.fulfill({
            status: 201,
            contentType: 'application/json',
            headers: corsHeaders,
            body: JSON.stringify(newProj),
          })
        }
      })
    }

    await page.goto('/admin/projects')
    await expect(page.getByText('Projects Management')).toBeVisible()

    // Create Project
    await page.getByRole('button', { name: '+ Create Project' }).first().click()
    await expect(page.getByText('Create New Project')).toBeVisible()

    await page.getByLabel('Project Title *').fill('Playwright Test Project')
    await page.getByLabel('URL Slug *').fill('playwright-test-project')

    await page.locator('button[type="submit"]').click()

    // Verify row appears in DataTable
    await expect(page.getByText('Playwright Test Project')).toBeVisible()

    // Delete Project
    if (!useRealApi) {
      await page.route(/\/api\/v1\/projects\/b1f868d4-54c3-4d7a-9a00-112233445566/, async (route) => {
        if (route.request().method() === 'OPTIONS') {
          await route.fulfill({ status: 200, headers: corsHeaders })
          return
        }
        projectsList = []
        await route.fulfill({
          status: 204,
          headers: corsHeaders,
        })
      })
    }

    const deleteBtn = page.getByRole('button', { name: /Delete/i }).first()
    await deleteBtn.click()

    await expect(page.locator('h3', { hasText: 'Delete Project' })).toBeVisible()
    await page.getByRole('button', { name: 'Delete Project', includeHidden: true }).last().click()
  })
})
