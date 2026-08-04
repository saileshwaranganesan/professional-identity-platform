/*
 * Achievement Columns Definition
 *
 * DataTable ColumnDef definitions for Achievements list view.
 */

import { Button } from '@/components/ui/Button'
import type { ColumnDef } from '@/components/crud'
import type { Achievement } from '@/domain/achievements'

export interface AchievementColumnsOptions {
  onEdit: (achievement: Achievement) => void
  onDelete: (achievement: Achievement) => void
}

export function createAchievementColumns({
  onEdit,
  onDelete,
}: AchievementColumnsOptions): ColumnDef<Achievement>[] {
  return [
    {
      key: 'title',
      header: 'Title & Summary',
      renderCell: (item: Achievement) => (
        <div>
          <div style={{ fontWeight: 600, color: '#f8fafc' }}>{item.title}</div>
          {item.description && (
            <div
              style={{
                fontSize: '0.75rem',
                color: '#94a3b8',
                marginTop: '0.125rem',
                maxWidth: '320px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {item.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'organization',
      header: 'Organization',
      renderCell: (item: Achievement) => (
        <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{item.organization ?? '—'}</span>
      ),
    },
    {
      key: 'achievementDate',
      header: 'Date',
      renderCell: (item: Achievement) => (
        <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{item.achievementDate ?? '—'}</span>
      ),
    },
    {
      key: 'url',
      header: 'Link',
      renderCell: (item: Achievement) =>
        item.achievementUrl ? (
          <a
            href={item.achievementUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#38bdf8', fontSize: '0.875rem', textDecoration: 'underline' }}
          >
            View Link ↗
          </a>
        ) : (
          <span style={{ color: '#64748b', fontSize: '0.875rem' }}>—</span>
        ),
    },
    {
      key: 'actions',
      header: 'Actions',
      renderCell: (item: Achievement) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary" size="small" onClick={() => onEdit(item)}>
            Edit
          </Button>
          <Button variant="danger" size="small" onClick={() => onDelete(item)}>
            Delete
          </Button>
        </div>
      ),
    },
  ]
}
