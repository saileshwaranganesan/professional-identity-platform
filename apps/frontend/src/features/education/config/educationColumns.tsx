/*
 * Education DataTable Column Definitions
 *
 * Strongly-typed ColumnDef<Education>[] configuration for Education DataTable.
 * Render institution/degree, field of study, period, grade, and action buttons.
 */

import { Button } from '@/components/ui/Button'
import type { ColumnDef } from '@/components/crud'
import type { Education } from '@/domain/education'

interface CreateEducationColumnsOptions {
  onEdit: (education: Education) => void
  onDelete: (education: Education) => void
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  } catch {
    return dateStr
  }
}

export function createEducationColumns({
  onEdit,
  onDelete,
}: CreateEducationColumnsOptions): ColumnDef<Education>[] {
  return [
    {
      key: 'institution',
      header: 'Institution / Degree',
      renderCell: (edu) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 600, color: '#f8fafc' }}>{edu.institution}</span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{edu.degree}</span>
        </div>
      ),
    },
    {
      key: 'fieldOfStudy',
      header: 'Field of Study',
      renderCell: (edu) => (
        <span style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>
          {edu.fieldOfStudy || '—'}
        </span>
      ),
    },
    {
      key: 'period',
      header: 'Period',
      renderCell: (edu) => {
        const end = edu.currentlyStudying
          ? 'Present'
          : edu.endDate
          ? formatDate(edu.endDate)
          : '—'
        return (
          <span style={{ fontSize: '0.8125rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
            {formatDate(edu.startDate)} – {end}
          </span>
        )
      },
    },
    {
      key: 'grade',
      header: 'Grade / Score',
      align: 'center',
      renderCell: (edu) => (
        <span style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>
          {edu.grade || '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      renderCell: (edu) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <Button variant="secondary" size="small" onClick={() => onEdit(edu)}>
            Edit
          </Button>
          <Button variant="danger" size="small" onClick={() => onDelete(edu)}>
            Delete
          </Button>
        </div>
      ),
    },
  ]
}