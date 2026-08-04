/*
 * Certification Columns Definition
 *
 * DataTable ColumnDef definitions for Certifications list view.
 */

import { Button } from '@/components/ui/Button'
import type { ColumnDef } from '@/components/crud'
import type { Certification } from '@/domain/certifications'

export interface CertificationColumnsOptions {
  onEdit: (certification: Certification) => void
  onDelete: (certification: Certification) => void
}

export function createCertificationColumns({
  onEdit,
  onDelete,
}: CertificationColumnsOptions): ColumnDef<Certification>[] {
  return [
    {
      key: 'name',
      header: 'Certification Name',
      renderCell: (item: Certification) => (
        <div>
          <div style={{ fontWeight: 600, color: '#f8fafc' }}>{item.name}</div>
          {item.credentialId && (
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.125rem' }}>
              ID: {item.credentialId}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'issuingOrganization',
      header: 'Issuing Organization',
      renderCell: (item: Certification) => (
        <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{item.issuingOrganization}</span>
      ),
    },
    {
      key: 'issueDate',
      header: 'Issue Date',
      renderCell: (item: Certification) => (
        <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{item.issueDate}</span>
      ),
    },
    {
      key: 'expiryDate',
      header: 'Expiry Date',
      renderCell: (item: Certification) => (
        <span style={{ color: item.doesNotExpire ? '#4ade80' : '#94a3b8', fontSize: '0.875rem' }}>
          {item.doesNotExpire ? 'Does Not Expire' : (item.expiryDate ?? 'N/A')}
        </span>
      ),
    },
    {
      key: 'credential',
      header: 'Credential',
      renderCell: (item: Certification) =>
        item.credentialUrl ? (
          <a
            href={item.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#38bdf8', fontSize: '0.875rem', textDecoration: 'underline' }}
          >
            Verify ↗
          </a>
        ) : (
          <span style={{ color: '#64748b', fontSize: '0.875rem' }}>—</span>
        ),
    },
    {
      key: 'actions',
      header: 'Actions',
      renderCell: (item: Certification) => (
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
