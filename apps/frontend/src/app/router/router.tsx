/*
 * TanStack Router Configuration
 *
 * Configures public routes (Home, About), authentication route (/login),
 * and protected administration route hierarchy (/admin/*).
 */

import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router'

import { AppLayout } from '@/app/layouts/AppLayout'
import { AdminLayout } from '@/app/layouts/AdminLayout'
import { AdminGuard } from './guards/AdminGuard'

import { AboutPage } from './routes/about'
import { HomePage } from './routes/home'
import { LoginPage } from './routes/login'
import { AdminDashboardPage } from './routes/admin/dashboard'
import { AdminProjectsPage } from './routes/admin/projects'
import { AdminExperiencePage } from './routes/admin/experience'
import { AdminSkillsPage } from './routes/admin/skills'
import { AdminEducationPage } from './routes/admin/education'
import { AdminMessagesPage } from './routes/admin/messages'
import { AdminSettingsPage } from './routes/admin/settings'

const rootRoute = createRootRoute({
  component: function RootComponent() {
    return <Outlet />
  },
})

// Public shell route
const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'public-layout',
  component: function PublicLayoutComponent() {
    return (
      <AppLayout>
        <Outlet />
      </AppLayout>
    )
  },
})

const indexRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/',
  component: HomePage,
})

const aboutRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/about',
  component: AboutPage,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

// Protected Admin route hierarchy
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: function ProtectedAdminComponent() {
    return (
      <AdminGuard>
        <AdminLayout>
          <Outlet />
        </AdminLayout>
      </AdminGuard>
    )
  },
})

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/',
  component: AdminDashboardPage,
})

const adminProjectsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/projects',
  component: AdminProjectsPage,
})

const adminExperienceRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/experience',
  component: AdminExperiencePage,
})

const adminSkillsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/skills',
  component: AdminSkillsPage,
})

const adminEducationRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/education',
  component: AdminEducationPage,
})

const adminMessagesRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/messages',
  component: AdminMessagesPage,
})

const adminSettingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/settings',
  component: AdminSettingsPage,
})

const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([indexRoute, aboutRoute]),
  loginRoute,
  adminLayoutRoute.addChildren([
    adminDashboardRoute,
    adminProjectsRoute,
    adminExperienceRoute,
    adminSkillsRoute,
    adminEducationRoute,
    adminMessagesRoute,
    adminSettingsRoute,
  ]),
])

export const router = createRouter({
  routeTree,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
