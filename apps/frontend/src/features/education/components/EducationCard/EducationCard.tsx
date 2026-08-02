/*
 * EducationCard Component
 *
 * Feature component for rendering a single Education entry (Layer 4 — Presentation Layer).
 * Composes existing UI primitives (Card, Heading, Text).
 */

import { Card } from '@/components/ui/Card'
import { Heading } from '@/components/ui/Heading'
import { Text } from '@/components/ui/Text'
import type { Education } from '@/domain/education'

import styles from './EducationCard.module.css'

export interface EducationCardProps {
  education: Education
  className?: string
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric' })
  } catch {
    return dateStr
  }
}

export function EducationCard({ education, className }: EducationCardProps) {
  const period = education.currentlyStudying
    ? `${formatDate(education.startDate)} — Present`
    : education.endDate
    ? `${formatDate(education.startDate)} — ${formatDate(education.endDate)}`
    : formatDate(education.startDate)

  return (
    <Card variant="outlined" padding="medium" className={className}>
      <div className={styles.card ?? ''}>
        <div className={styles.header ?? ''}>
          <Heading level={3}>{education.degree}</Heading>
          <div className={styles.meta ?? ''}>
            <Text as="span" variant="small">
              {education.institution}
            </Text>
            <Text as="span" variant="small">
              •
            </Text>
            <Text as="span" variant="small">
              {period}
            </Text>
            {education.fieldOfStudy && (
              <>
                <Text as="span" variant="small">
                  •
                </Text>
                <Text as="span" variant="small">
                  {education.fieldOfStudy}
                </Text>
              </>
            )}
            {education.grade && (
              <>
                <Text as="span" variant="small">
                  •
                </Text>
                <Text as="span" variant="small">
                  Grade: {education.grade}
                </Text>
              </>
            )}
          </div>
        </div>

        {education.description && (
          <Text variant="body">{education.description}</Text>
        )}
      </div>
    </Card>
  )
}