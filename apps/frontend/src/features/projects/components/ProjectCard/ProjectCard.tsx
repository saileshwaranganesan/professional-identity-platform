/*
 * ProjectCard Component
 *
 * Feature component for rendering a single Project (Layer 4 — Presentation Layer).
 * Composes existing UI primitives (Card, Heading, Text, Button).
 */

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Heading } from '@/components/ui/Heading'
import { Text } from '@/components/ui/Text'
import type { Project } from '@/domain/projects'

import styles from './ProjectCard.module.css'

export interface ProjectCardProps {
  project: Project
  className?: string
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <Card variant="elevated" padding="medium" className={className}>
      <div className={styles.card ?? ''}>
        <div className={styles.content ?? ''}>
          <Heading level={3}>{project.title}</Heading>
          <Text variant="muted">{project.description}</Text>

          {project.technologies.length > 0 && (
            <div className={styles.tags ?? ''}>
              {project.technologies.map((tech) => (
                <span key={tech} className={styles.tag ?? ''}>
                  <Text as="span" variant="small">
                    {tech}
                  </Text>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className={styles.actions ?? ''}>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="small">
                Code
              </Button>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="primary" size="small">
                Demo
              </Button>
            </a>
          )}
        </div>
      </div>
    </Card>
  )
}
