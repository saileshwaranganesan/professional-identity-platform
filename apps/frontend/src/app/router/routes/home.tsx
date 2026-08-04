/*
 * HomePage Component
 *
 * Public portfolio landing page (Layer 4 — Presentation Layer).
 * Consumes PublicPortfolioView to dynamically render backend portfolio data.
 */

import { PublicPortfolioView } from '@/features/portfolio'

export function HomePage() {
  return <PublicPortfolioView username="admin" />
}
