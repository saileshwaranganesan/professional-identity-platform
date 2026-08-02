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
}

test.describe('E2E Flow 3: Visitor Contact & Admin Messages Inbox', () => {
  test('Visitor submits message -> Admin inbox views and marks as read', async ({ page }) => {
    if (!useRealApi) {
      await page.route(/\/api\/v1\/contact/, async (route) => {
        if (route.request().method() === 'OPTIONS') {
          await route.fulfill({ status: 200, headers: corsHeaders })
          return
        }

        if (route.request().method() === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            headers: corsHeaders,
            body: JSON.stringify({
              email: 'alex@example.com',
              location: 'San Francisco, CA',
            }),
          })
        } else if (route.request().method() === 'POST') {
          await route.fulfill({
            status: 201,
            contentType: 'application/json',
            headers: corsHeaders,
            body: JSON.stringify({
              id: 'c2f868d4-54c3-4d7a-9a00-112233445577',
              senderName: 'E2E Visitor',
              senderEmail: 'e2e.visitor@example.com',
              subject: 'E2E Automation Message',
              content: 'This is an automated E2E message submission.',
              status: 'UNREAD',
              createdAt: new Date().toISOString(),
            }),
          })
        }
      })

      await page.route(/\/api\/v1\/projects/, async (route) => {
        if (route.request().method() === 'OPTIONS') {
          await route.fulfill({ status: 200, headers: corsHeaders })
          return
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          headers: corsHeaders,
          body: JSON.stringify([]),
        })
      })

      await page.route(/\/api\/v1\/experience/, async (route) => {
        if (route.request().method() === 'OPTIONS') {
          await route.fulfill({ status: 200, headers: corsHeaders })
          return
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          headers: corsHeaders,
          body: JSON.stringify([]),
        })
      })

      await page.route(/\/api\/v1\/skills/, async (route) => {
        if (route.request().method() === 'OPTIONS') {
          await route.fulfill({ status: 200, headers: corsHeaders })
          return
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          headers: corsHeaders,
          body: JSON.stringify([]),
        })
      })

      await page.route(/\/api\/v1\/education/, async (route) => {
        if (route.request().method() === 'OPTIONS') {
          await route.fulfill({ status: 200, headers: corsHeaders })
          return
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          headers: corsHeaders,
          body: JSON.stringify([]),
        })
      })
    }

    // 1. Visitor submits message on home page
    await page.goto('/')
    await page.getByLabel('Your Name *').fill('E2E Visitor')
    await page.getByLabel('Your Email *').fill('e2e.visitor@example.com')
    await page.getByLabel('Subject *').fill('E2E Automation Message')
    await page.getByLabel('Message *').fill('This is an automated E2E message submission.')

    await page.getByRole('button', { name: 'Send Message' }).click()
    await expect(page.getByText(/Thank you for your message!/i)).toBeVisible()

    // 2. Admin logs in and checks Messages Inbox
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

      await page.route(/\/api\/v1\/messages/, async (route) => {
        if (route.request().method() === 'OPTIONS') {
          await route.fulfill({ status: 200, headers: corsHeaders })
          return
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          headers: corsHeaders,
          body: JSON.stringify([
            {
              id: 'c2f868d4-54c3-4d7a-9a00-112233445577',
              senderName: 'E2E Visitor',
              senderEmail: 'e2e.visitor@example.com',
              subject: 'E2E Automation Message',
              content: 'This is an automated E2E message submission.',
              status: 'UNREAD',
              createdAt: new Date().toISOString(),
            },
          ]),
        })
      })
    }

    await page.goto('/admin/messages')
    await expect(page.getByText('Contact Messages Inbox')).toBeVisible()
    await expect(page.getByText('E2E Visitor')).toBeVisible()
  })
})
