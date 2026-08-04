/*
 * ProjectDetailPage Component
 *
 * Case study detail page for a published project (/projects/$slug).
 * Consumes useProjectBySlug hook to fetch project metadata from backend.
 */

import { useParams } from '@tanstack/react-router'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Heading } from '@/components/ui/Heading'
import { MetaSeo } from '@/components/ui/MetaSeo/MetaSeo'
import { useProjectBySlug } from '@/application/portfolio'

import styles from './home.module.css'

export function ProjectDetailPage() {
  const { slug } = useParams({ from: '/public-layout/projects/$slug' })
  const { data: project, isLoading, isError, error, refetch } = useProjectBySlug(slug)

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#38bdf8', fontSize: '1.125rem' }}>
          Loading project case study...
        </div>
      </div>
    )
  }

  if (isError || !project) {
    return (
      <div className={styles.container}>
        <Card variant="flat" padding="medium">
          <div style={{ color: '#fca5a5', padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '0.5rem' }}>
              Project "{slug}" was not found or is unpublished.
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>
              {error instanceof Error ? error.message : 'Please check the URL or return home.'}
            </p>
            <Button variant="primary" size="medium" onClick={() => void refetch()}>
              Retry
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <MetaSeo
        title={`${project.title} — Project Case Study`}
        description={project.shortDescription || project.description || `Case study for ${project.title}`}
        canonicalUrl={window.location.href}
      />

      <section className={styles.hero}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <Heading level={1}>{project.title}</Heading>
            <span className={styles.timelineDate}>{project.status}</span>
          </div>

          {project.headline && (
            <p style={{ fontSize: '1.25rem', color: '#38bdf8', fontWeight: 500 }}>
              {project.headline}
            </p>
          )}

          {project.shortDescription && (
            <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: '1.6', marginTop: '0.5rem' }}>
              {project.shortDescription}
            </p>
          )}

          <div className={styles.ctaGroup}>
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="medium">
                  Open Live Demo ↗
                </Button>
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="medium">
                  View Source Code (GitHub) ↗
                </Button>
              </a>
            )}
            {project.documentationUrl && (
              <a href={project.documentationUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="medium">
                  Documentation ↗
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Case Study Details */}
      <section className={styles.section}>
        <Heading level={2}>Project Details</Heading>
        <Card variant="flat" padding="medium">
          <div style={{ fontSize: '0.9375rem', color: '#e2e8f0', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
            {project.description}
          </div>
        </Card>
      </section>

      {/* Impact / Key Outcomes */}
      {project.impact && (
        <section className={styles.section}>
          <Heading level={2}>Key Outcomes & Impact</Heading>
          <Card variant="flat" padding="medium">
            <p style={{ color: '#4ade80', fontSize: '0.9375rem', lineHeight: '1.6' }}>
              {project.impact}
            </p>
          </Card>
        </section>
      )}

      {/* Tech Stack Used */}
      {project.technologies && project.technologies.length > 0 && (
        <section className={styles.section}>
          <Heading level={2}>Technologies & Architecture</Heading>
          <div className={styles.badgeGroup}>
            {project.technologies.map((tech) => (
              <span key={tech} className={styles.badge} style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}>
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
