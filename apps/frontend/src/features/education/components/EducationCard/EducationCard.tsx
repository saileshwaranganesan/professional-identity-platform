/*
 * EducationCard Component
 *
 * Feature component for rendering a single Education entry (Layer 4 — Presentation Layer).
 * Composes existing UI primitives (Card, Heading, Text).
 */

import { Card } from '@/components/ui/Card'
import { Heading } from '@/components/ui/Heading'
import { Text } from '@/components/ui/Text'

import type { Education } from '../../types/education'

import styles from './EducationCard.module.css'

export interface EducationCardProps {
  education: Education
  className?: string
}

export function EducationCard({ education, className }: EducationCardProps) {
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
              {education.duration}
            </Text>
            {education.location && (
              <>
                <Text as="span" variant="small">
                  •
                </Text>
                <Text as="span" variant="small">
                  {education.location}
                </Text>
              </>
            )}
            {education.cgpa && (
              <>
                <Text as="span" variant="small">
                  •
                </Text>
                <Text as="span" variant="small">
                  GPA: {education.cgpa}
                </Text>
              </>
            )}
          </div>
        </div>

        {education.coursework && education.coursework.length > 0 && (
          <div className={styles.details ?? ''}>
            <Text variant="muted">Relevant Coursework:</Text>
            <div className={styles.list ?? ''}>
              {education.coursework.map((course) => (
                <span key={course} className={styles.listItem ?? ''}>
                  <Text as="span" variant="small">
                    {course}
                  </Text>
                </span>
              ))}
            </div>
          </div>
        )}

        {education.achievements && education.achievements.length > 0 && (
          <div className={styles.details ?? ''}>
            <Text variant="muted">Key Achievements:</Text>
            <div className={styles.bulletList ?? ''}>
              {education.achievements.map((achievement) => (
                <Text key={achievement} variant="body">
                  • {achievement}
                </Text>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
