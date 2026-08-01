/*
 * TanStack Router Configuration
 *
 * Configures application routes (Home, About) and binds the root route layout
 * to AppLayout (FSAS-001 §8.2 URL state management).
 */

import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router'

import { AppLayout } from '@/app/layouts/AppLayout'

import { AboutPage } from './routes/about'
import { HomePage } from './routes/home'

const rootRoute = createRootRoute({
  component: function RootComponent() {
    return (
      <AppLayout>
        <Outlet />
      </AppLayout>
    )
  },
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
})

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute])

export const router = createRouter({
  routeTree,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
