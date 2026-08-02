/*
 * ExperienceCard Component
 *
 * Feature component for rendering a single Experience entry (Layer 4 — Presentation Layer).
 * Composes existing UI primitives (Card, Heading, Text).
 */

import { Card } from '@/components/ui/Card'
import { Heading } from '@/components/ui/Heading'
import { Text } from '@/components/ui/Text'

import type { Experience } from '@/domain/experience'

import styles from './ExperienceCard.module.css'

export interface ExperienceCardProps {
  experience: Experience
  className?: string
}

export function ExperienceCard({
  experience,
  className,
}: ExperienceCardProps) {
  const period = experience.endDate
    ? `${experience.startDate} — ${experience.endDate}`
    : experience.startDate

  return (
    <Card variant="outlined" padding="medium" className={className}>
      <div className={styles.card ?? ''}>
        <div className={styles.header ?? ''}>
          <Heading level={3}>{experience.position}</Heading>
          <div className={styles.meta ?? ''}>
            <Text as="span" variant="small">
              {experience.company}
            </Text>
            <Text as="span" variant="small">
              •
            </Text>
            <Text as="span" variant="small">
              {period}
            </Text>
            {experience.location && (
              <>
                <Text as="span" variant="small">
                  •
                </Text>
                <Text as="span" variant="small">
                  {experience.location}
                </Text>
              </>
            )}
          </div>
        </div>

        <Text variant="body">{experience.description}</Text>

        {experience.technologies && experience.technologies.length > 0 && (
          <div className={styles.tags ?? ''}>
            {experience.technologies.map((tech) => (
              <span key={tech} className={styles.tag ?? ''}>
                <Text as="span" variant="small">
                  {tech}
                </Text>
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
