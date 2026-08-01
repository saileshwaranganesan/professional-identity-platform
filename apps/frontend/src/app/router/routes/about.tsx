/*
 * AboutPage Placeholder Component
 *
 * About route view component (Layer 4 — Presentation Layer).
 * Composes existing UI primitives (Card, Heading, Text).
 */

import { Card } from '@/components/ui/Card'
import { Heading } from '@/components/ui/Heading'
import { Text } from '@/components/ui/Text'

export function AboutPage() {
  return (
    <Card variant="elevated" padding="medium">
      <Heading level={1}>About</Heading>
      <Text variant="body">
        Platform architecture and system information.
      </Text>
    </Card>
  )
}
