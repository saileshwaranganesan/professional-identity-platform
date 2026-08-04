import { useParams, Link } from '@tanstack/react-router'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MetaSeo } from '@/components/ui/MetaSeo/MetaSeo'
import { useProjectBySlug } from '@/application/portfolio'
import { ProjectHero } from '@/features/projects/components/ProjectHero/ProjectHero'
import { BlockRenderer } from '@/features/projects/components/BlockRenderer/BlockRenderer'

export function ProjectDetailPage() {
  const { slug } = useParams({ from: '/public-layout/projects/$slug' })
  const { data: project, isLoading, isError, error, refetch } = useProjectBySlug(slug)

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#38bdf8', fontSize: '1.25rem' }}>Loading case study...</p>
      </div>
    )
  }

  if (isError || !project) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <Card variant="flat" padding="medium">
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#fca5a5', fontWeight: 600, fontSize: '1.5rem', marginBottom: '1rem' }}>
              Project Not Found
            </p>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
              {error instanceof Error ? error.message : "The case study you're looking for doesn't exist or isn't published yet."}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <Button variant="secondary">Return Home</Button>
              </Link>
              <Button variant="primary" onClick={() => void refetch()}>Retry</Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div style={{ paddingBottom: '6rem' }}>
      <MetaSeo
        title={`${project.title} | Case Study`}
        description={project.shortDescription || project.description || `Engineering case study for ${project.title}`}
        canonicalUrl={window.location.href}
      />

      <Link 
        to="/" 
        style={{ 
          position: 'fixed', 
          top: '2rem', 
          left: '2rem', 
          zIndex: 50, 
          textDecoration: 'none',
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          padding: '0.5rem 1rem',
          borderRadius: '999px',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#cbd5e1',
          backdropFilter: 'blur(10px)',
          fontSize: '0.875rem'
        }}
      >
        &larr; Back to Portfolio
      </Link>

      <ProjectHero project={project} />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem' }}>
        {project.blocks.map(block => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </div>
    </div>
  )
}
