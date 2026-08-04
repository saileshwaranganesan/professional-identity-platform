import { Button } from '@/components/ui/Button'
import { Heading } from '@/components/ui/Heading'
import type { Project } from '@/domain/projects'

export function ProjectHero({ project }: { project: Project }) {
  return (
    <section style={{ padding: '4rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <Heading level={1} style={{ fontSize: '3rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          {project.title}
        </Heading>
        {project.headline && (
          <p style={{ fontSize: '1.5rem', color: '#38bdf8', fontWeight: 500, marginBottom: '1.5rem' }}>
            {project.headline}
          </p>
        )}
        {project.shortDescription && (
          <p style={{ fontSize: '1.125rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '2rem' }}>
            {project.shortDescription}
          </p>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', marginBottom: '2.5rem', color: '#cbd5e1', fontSize: '0.875rem' }}>
          {project.role && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Role</span>
              <span style={{ fontWeight: 500 }}>{project.role}</span>
            </div>
          )}
          {project.duration && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Duration</span>
              <span style={{ fontWeight: 500 }}>{project.duration}</span>
            </div>
          )}
          {project.teamSize != null && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Team Size</span>
              <span style={{ fontWeight: 500 }}>{project.teamSize} {project.teamSize === 1 ? 'Person' : 'People'}</span>
            </div>
          )}
        </div>

        {project.technologies && project.technologies.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
            {project.technologies.map(tech => (
              <span 
                key={tech} 
                style={{ 
                  backgroundColor: 'rgba(56, 189, 248, 0.1)', 
                  color: '#38bdf8', 
                  padding: '0.375rem 1rem', 
                  borderRadius: '999px', 
                  fontSize: '0.875rem', 
                  fontWeight: 500,
                  border: '1px solid rgba(56, 189, 248, 0.2)' 
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="medium">Live Demo &rarr;</Button>
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" size="medium">View Source</Button>
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
