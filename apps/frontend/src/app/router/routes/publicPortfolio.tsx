/*
 * PublicPortfolioPage Component
 *
 * Route component for /public/$username rendering a user's portfolio by username.
 */

import { useParams } from '@tanstack/react-router'

import { PublicPortfolioView } from '@/features/portfolio'

export function PublicPortfolioPage() {
  const { username } = useParams({ from: '/public-layout/public/$username' })
  return <PublicPortfolioView username={username} />
}
