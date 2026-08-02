/* eslint-disable react-refresh/only-export-components */
/*
 * TanStack Router Configuration
 *
 * Configures public routes (Home, About), authentication route (/login),
 * and protected administration route hierarchy (/admin/*) with route-based
 * code-splitting (React.lazy / Suspense) for optimal production bundle size.
 */

import { lazy, Suspense } from 'react'
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router'

import { AppLayout } from '@/app/layouts/AppLayout'
import { AdminLayout } from '@/app/layouts/AdminLayout'
import { AdminGuard } from './guards/AdminGuard'

// Eager load initial landing page for fast initial LCP
import { HomePage } from './routes/home'

// Lazy load secondary public & admin routes
const AboutPage = lazy(() => import('./routes/about').then((m) => ({ default: m.AboutPage })))
const LoginPage = lazy(() => import('./routes/login').then((m) => ({ default: m.LoginPage })))
const AdminDashboardPage = lazy(() => import('./routes/admin/dashboard').then((m) => ({ default: m.AdminDashboardPage })))
const AdminProjectsPage = lazy(() => import('./routes/admin/projects').then((m) => ({ default: m.AdminProjectsPage })))
const AdminExperiencePage = lazy(() => import('./routes/admin/experience').then((m) => ({ default: m.AdminExperiencePage })))
const AdminSkillsPage = lazy(() => import('./routes/admin/skills').then((m) => ({ default: m.AdminSkillsPage })))
const AdminEducationPage = lazy(() => import('./routes/admin/education').then((m) => ({ default: m.AdminEducationPage })))
const AdminMessagesPage = lazy(() => import('./routes/admin/messages').then((m) => ({ default: m.AdminMessagesPage })))
const AdminSettingsPage = lazy(() => import('./routes/admin/settings').then((m) => ({ default: m.AdminSettingsPage })))

function RouteFallback() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', padding: '2rem' }}>
      <div style={{ color: 'var(--color-primary-400, #38bdf8)', fontWeight: 500 }}>Loading view...</div>
    </div>
  )
}

function LazyRoute({ Component }: { Component: React.ComponentType }) {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Component />
    </Suspense>
  )
}

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
  component: function AboutRouteComponent() {
    return <LazyRoute Component={AboutPage} />
  },
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: function LoginRouteComponent() {
    return <LazyRoute Component={LoginPage} />
  },
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
  component: function AdminDashboardRouteComponent() {
    return <LazyRoute Component={AdminDashboardPage} />
  },
})

const adminProjectsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/projects',
  component: function AdminProjectsRouteComponent() {
    return <LazyRoute Component={AdminProjectsPage} />
  },
})

const adminExperienceRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/experience',
  component: function AdminExperienceRouteComponent() {
    return <LazyRoute Component={AdminExperiencePage} />
  },
})

const adminSkillsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/skills',
  component: function AdminSkillsRouteComponent() {
    return <LazyRoute Component={AdminSkillsPage} />
  },
})

const adminEducationRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/education',
  component: function AdminEducationRouteComponent() {
    return <LazyRoute Component={AdminEducationPage} />
  },
})

const adminMessagesRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/messages',
  component: function AdminMessagesRouteComponent() {
    return <LazyRoute Component={AdminMessagesPage} />
  },
})

const adminSettingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/settings',
  component: function AdminSettingsRouteComponent() {
    return <LazyRoute Component={AdminSettingsPage} />
  },
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
