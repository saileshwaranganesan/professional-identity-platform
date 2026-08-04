import { Link } from '@tanstack/react-router'
import { Card } from '@/components/ui/Card'
import { Heading } from '@/components/ui/Heading'
import { Text } from '@/components/ui/Text'
import type { ProjectSummary } from '@/domain/projects'
import styles from './ProjectCard.module.css'

export interface ProjectCardProps {
  project: ProjectSummary
  className?: string
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <Link to="/projects/$slug" params={{ slug: project.slug }} className={`${styles.link ?? ''} ${className ?? ''}`}>
      <Card variant="elevated" padding="medium" className={styles.card ?? ''}>
        
        {project.featured && (
          <div className={styles.featuredBadge ?? ''}>
            Featured
          </div>
        )}

        <div className={styles.content ?? ''}>
          <Heading level={3}>{project.title}</Heading>
          
          {project.headline && (
            <Text variant="muted" className={styles.tagline ?? ''}>
              {project.headline}
            </Text>
          )}

          {project.highlights && project.highlights.length > 0 && (
            <div className={styles.highlightsContainer ?? ''}>
              <ul className={styles.highlightsList ?? ''}>
                {project.highlights.slice(0, 3).map((highlight, idx) => (
                  <li key={idx} className={styles.highlightItem ?? ''}>
                    <Text as="span" variant="small">
                      {highlight}
                    </Text>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className={styles.footer ?? ''}>
          <span className={styles.viewProjectCta ?? ''}>
            View Case Study &rarr;
          </span>
        </div>
      </Card>
    </Link>
  )
}
