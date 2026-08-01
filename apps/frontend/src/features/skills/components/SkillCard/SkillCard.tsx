/*
 * SkillCard Component
 *
 * Feature component for rendering a group of skills by category (Layer 4 — Presentation Layer).
 * Composes existing UI primitives (Card, Heading, Text).
 */

import { Card } from '@/components/ui/Card'
import { Heading } from '@/components/ui/Heading'
import { Text } from '@/components/ui/Text'

import type { Skill } from '../../types/skill'

import styles from './SkillCard.module.css'

export interface SkillCardProps {
  category: string
  skills: Skill[]
  className?: string
}

export function SkillCard({ category, skills, className }: SkillCardProps) {
  return (
    <Card variant="elevated" padding="medium" className={className}>
      <div className={styles.card ?? ''}>
        <div className={styles.header ?? ''}>
          <Heading level={3}>{category}</Heading>
          <Text variant="small">
            {skills.length} {skills.length === 1 ? 'skill' : 'skills'}
          </Text>
        </div>

        <div className={styles.tags ?? ''}>
          {skills.map((skill) => (
            <span key={skill.id} className={styles.tag ?? ''}>
              <Text as="span" variant="small">
                {skill.name}
              </Text>
            </span>
          ))}
        </div>
      </div>
    </Card>
  )
}
