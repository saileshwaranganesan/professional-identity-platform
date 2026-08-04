import type { ProjectBlock } from '@/domain/projects'

interface BlockRendererProps {
  block: ProjectBlock
}

export function BlockRenderer({ block }: BlockRendererProps) {
  const { blockType, payload } = block

  switch (blockType) {
    case 'MARKDOWN':
      return (
        <div style={{ marginBottom: '3rem' }}>
          {payload.title && <h2 style={{ color: '#e2e8f0', fontSize: '1.5rem', marginBottom: '1rem' }}>{payload.title}</h2>}
          <div style={{ color: '#94a3b8', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {payload.content}
          </div>
        </div>
      )
    case 'GALLERY':
      return (
        <div style={{ marginBottom: '3rem' }}>
          {payload.title && <h2 style={{ color: '#e2e8f0', fontSize: '1.5rem', marginBottom: '1.5rem' }}>{payload.title}</h2>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {(payload.images || []).map((img: any, i: number) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <img 
                  src={img.url} 
                  alt={img.title ?? 'Gallery image'} 
                  style={{ width: '100%', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)', objectFit: 'cover' }} 
                />
                {(img.title || img.caption) && (
                  <div>
                    {img.title && <h4 style={{ margin: '0 0 0.25rem 0', color: '#e2e8f0', fontSize: '1.125rem' }}>{img.title}</h4>}
                    {img.caption && <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.5 }}>{img.caption}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )
    case 'METRICS':
      return (
        <div style={{ marginBottom: '3rem' }}>
          {payload.title && <h2 style={{ color: '#e2e8f0', fontSize: '1.5rem', marginBottom: '1.5rem' }}>{payload.title}</h2>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {(payload.metrics || []).map((m: any, i: number) => (
              <div key={i} style={{ padding: '1.5rem', backgroundColor: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#38bdf8', marginBottom: '0.5rem' }}>{m.value}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      )
    case 'TIMELINE':
      return (
        <div style={{ marginBottom: '3rem' }}>
          {payload.title && <h2 style={{ color: '#e2e8f0', fontSize: '1.5rem', marginBottom: '1.5rem' }}>{payload.title}</h2>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '2px solid rgba(56, 189, 248, 0.3)', paddingLeft: '1.5rem', marginLeft: '0.5rem' }}>
            {(payload.events || []).map((ev: any, i: number) => (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-1.85rem', top: '0.25rem', width: '0.75rem', height: '0.75rem', borderRadius: '50%', backgroundColor: '#38bdf8' }} />
                <h4 style={{ margin: '0 0 0.25rem 0', color: '#e2e8f0', fontSize: '1.125rem' }}>{ev.title}</h4>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem' }}>{ev.description}</p>
              </div>
            ))}
          </div>
        </div>
      )
    default:
      return (
        <div style={{ padding: '1rem', border: '1px dashed red', color: 'red' }}>
          Unsupported block type: {blockType}
        </div>
      )
  }
}
