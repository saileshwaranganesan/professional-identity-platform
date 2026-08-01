/*
 * AboutPage Component
 *
 * Public portfolio About section (Layer 4 — Presentation Layer).
 * Composes existing UI primitives (Heading, Text, Card, Button).
 * Pure presentation — zero API calls, zero auth logic.
 */

import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Heading } from '@/components/ui/Heading'
import { Text } from '@/components/ui/Text'

import styles from './about.module.css'

export function AboutPage() {
  return (
    <div className={styles.container ?? ''}>
      {/* --- Professional Introduction --- */}
      <section className={styles.section ?? ''}>
        <div className={styles.introHeader ?? ''}>
          <Heading level={1}>About Me</Heading>
          <Text variant="muted">
            Frontend Engineer specializing in component architecture, state
            management systems, and web performance.
          </Text>
        </div>
        <Card variant="flat" padding="medium">
          <Text variant="body">
            I build resilient, type-safe web applications focused on performance
            and long-term maintainability. With extensive experience in React,
            TypeScript, and modern frontend tooling, I advocate for clear
            architectural boundaries, modular component design, and automated
            testing.
          </Text>
        </Card>
      </section>

      {/* --- Professional Focus & Engineering Values --- */}
      <section className={styles.section ?? ''}>
        <Heading level={2}>Engineering Philosophy</Heading>
        <div className={styles.grid ?? ''}>
          <Card variant="elevated" padding="medium">
            <Heading level={3}>Clean Architecture</Heading>
            <Text variant="muted">
              Enforcing strict separation of concerns between domain logic,
              transport infrastructure, and presentation components.
            </Text>
          </Card>

          <Card variant="elevated" padding="medium">
            <Heading level={3}>Strict Type Safety</Heading>
            <Text variant="muted">
              Leveraging TypeScript strict mode and schema validation to catch
              defects at compile time rather than in production.
            </Text>
          </Card>
        </div>
      </section>

      {/* --- Education & Background --- */}
      <section className={styles.section ?? ''}>
        <Heading level={2}>Education & Background</Heading>
        <Card variant="outlined" padding="medium">
          <Heading level={3}>Bachelor of Science in Computer Science</Heading>
          <Text variant="small">
            Focus on software architecture, algorithms, and web systems
            engineering.
          </Text>
        </Card>
      </section>

      {/* --- Call to Action --- */}
      <Card variant="elevated" padding="medium">
        <Heading level={2}>Explore Featured Projects</Heading>
        <Text variant="body">
          Take a look at selected work demonstrating modern frontend
          architecture and design system design.
        </Text>
        <div className={styles.actionGroup ?? ''}>
          <Link to="/">
            <Button variant="primary" size="medium">
              View All Projects
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
