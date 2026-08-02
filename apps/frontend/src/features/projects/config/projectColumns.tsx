/*
 * Projects DataTable Column Definitions
 *
 * Strongly-typed ColumnDef<Project>[] configuration for Projects DataTable.
 * Render cell badges, URL links, status indicators, and action triggers.
 */

import { Button } from '@/components/ui/Button'
import type { ColumnDef } from '@/components/crud'
import type { Project, ProjectStatus } from '@/domain/projects'

interface CreateProjectColumnsOptions {
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
  onTogglePublish: (project: Project) => void
  onToggleFeature: (project: Project) => void
}

const statusBadgeStyles: Record<ProjectStatus, { bg: string; color: string; label: string }> = {
  COMPLETED: { bg: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', label: 'Completed' },
  IN_PROGRESS: { bg: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', label: 'In Progress' },
  PLANNED: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', label: 'Planned' },
  ARCHIVED: { bg: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8', label: 'Archived' },
}

export function createProjectColumns({
  onEdit,
  onDelete,
  onTogglePublish,
  onToggleFeature,
}: CreateProjectColumnsOptions): ColumnDef<Project>[] {
  return [
    {
      key: 'title',
      header: 'Project Title',
      renderCell: (project) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 600, color: '#f8fafc' }}>{project.title}</span>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>/{project.slug}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      renderCell: (project) => {
        const badge = statusBadgeStyles[project.status] ?? statusBadgeStyles.COMPLETED
        return (
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              backgroundColor: badge.bg,
              color: badge.color,
              display: 'inline-block',
            }}
          >
            {badge.label}
          </span>
        )
      },
    },
    {
      key: 'published',
      header: 'Published',
      align: 'center',
      renderCell: (project) => (
        <button
          type="button"
          onClick={() => onTogglePublish(project)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
            backgroundColor: project.published ? 'rgba(74, 222, 128, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: project.published ? '#4ade80' : '#fca5a5',
          }}
        >
          {project.published ? 'Published' : 'Draft'}
        </button>
      ),
    },
    {
      key: 'featured',
      header: 'Featured',
      align: 'center',
      renderCell: (project) => (
        <button
          type="button"
          onClick={() => onToggleFeature(project)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
            backgroundColor: project.featured ? 'rgba(245, 158, 11, 0.15)' : 'rgba(148, 163, 184, 0.1)',
            color: project.featured ? '#f59e0b' : '#64748b',
          }}
        >
          {project.featured ? 'Featured ★' : 'Standard'}
        </button>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      renderCell: (project) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <Button variant="secondary" size="small" onClick={() => onEdit(project)}>
            Edit
          </Button>
          <Button variant="danger" size="small" onClick={() => onDelete(project)}>
            Delete
          </Button>
        </div>
      ),
    },
  ]
}
