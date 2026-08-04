/*
 * Social Link Columns Definition
 *
 * DataTable ColumnDef definitions for Social Links list view.
 */

import { Button } from '@/components/ui/Button'
import type { ColumnDef } from '@/components/crud'
import type { SocialLink } from '@/domain/socialLinks'

import { SocialPlatformIcon } from './SocialPlatformIcon/SocialPlatformIcon'

export interface SocialLinkColumnsOptions {
  onEdit: (socialLink: SocialLink) => void
  onDelete: (socialLink: SocialLink) => void
}

export function createSocialLinkColumns({
  onEdit,
  onDelete,
}: SocialLinkColumnsOptions): ColumnDef<SocialLink>[] {
  return [
    {
      key: 'platform',
      header: 'Platform',
      renderCell: (item: SocialLink) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <SocialPlatformIcon platform={item.platform} size={20} />
          <span style={{ fontWeight: 600, color: '#f8fafc' }}>{item.platform}</span>
        </div>
      ),
    },
    {
      key: 'url',
      header: 'Profile URL',
      renderCell: (item: SocialLink) => (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#38bdf8', fontSize: '0.875rem', textDecoration: 'underline' }}
        >
          {item.url} ↗
        </a>
      ),
    },
    {
      key: 'displayOrder',
      header: 'Display Order',
      renderCell: (item: SocialLink) => (
        <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{item.displayOrder ?? 0}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      renderCell: (item: SocialLink) => (
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
