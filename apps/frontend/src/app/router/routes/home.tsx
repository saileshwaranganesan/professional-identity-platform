/*
 * HomePage Placeholder Component
 *
 * Home route view component (Layer 4 — Presentation Layer).
 * Composes existing UI primitives (Card, Heading, Text).
 */

import { Card } from '@/components/ui/Card'
import { Heading } from '@/components/ui/Heading'
import { Text } from '@/components/ui/Text'

export function HomePage() {
  return (
    <Card variant="elevated" padding="medium">
      <Heading level={1}>Home</Heading>
      <Text variant="body">
        Welcome to the Professional Identity Platform.
      </Text>
    </Card>
  )
}
