/*
 * Experience DataTable Column Definitions
 *
 * Strongly-typed ColumnDef<Experience>[] configuration for Experience DataTable.
 * Renders company/position, employment type badge, status indicator, date period, and actions.
 */

import { Button } from '@/components/ui/Button'
import type { ColumnDef } from '@/components/crud'
import type { Experience, EmploymentType } from '@/domain/experience'

interface CreateExperienceColumnsOptions {
  onEdit: (experience: Experience) => void
  onDelete: (experience: Experience) => void
}

const employmentTypeLabelMap: Record<EmploymentType, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  INTERNSHIP: 'Internship',
  CONTRACT: 'Contract',
  FREELANCE: 'Freelance',
  SELF_EMPLOYED: 'Self-employed',
}

const employmentTypeColors: Record<EmploymentType, { bg: string; color: string }> = {
  FULL_TIME: { bg: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' },
  PART_TIME: { bg: 'rgba(129, 140, 248, 0.15)', color: '#818cf8' },
  INTERNSHIP: { bg: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24' },
  CONTRACT: { bg: 'rgba(52, 211, 153, 0.15)', color: '#34d399' },
  FREELANCE: { bg: 'rgba(249, 115, 22, 0.15)', color: '#f97316' },
  SELF_EMPLOYED: { bg: 'rgba(232, 121, 249, 0.15)', color: '#e879f9' },
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  } catch {
    return dateStr
  }
}

export function createExperienceColumns({
  onEdit,
  onDelete,
}: CreateExperienceColumnsOptions): ColumnDef<Experience>[] {
  return [
    {
      key: 'company',
      header: 'Company / Role',
      renderCell: (exp) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 600, color: '#f8fafc' }}>{exp.company}</span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{exp.position}</span>
        </div>
      ),
    },
    {
      key: 'employmentType',
      header: 'Type',
      align: 'center',
      renderCell: (exp) => {
        const style = employmentTypeColors[exp.employmentType] ?? employmentTypeColors.FULL_TIME
        return (
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              backgroundColor: style.bg,
              color: style.color,
              display: 'inline-block',
              whiteSpace: 'nowrap',
            }}
          >
            {employmentTypeLabelMap[exp.employmentType]}
          </span>
        )
      },
    },
    {
      key: 'employmentStatus',
      header: 'Status',
      align: 'center',
      renderCell: (exp) => {
        const isCurrent = exp.employmentStatus === 'CURRENT'
        return (
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              backgroundColor: isCurrent ? 'rgba(74, 222, 128, 0.15)' : 'rgba(148, 163, 184, 0.1)',
              color: isCurrent ? '#4ade80' : '#94a3b8',
              display: 'inline-block',
            }}
          >
            {isCurrent ? 'Current' : 'Previous'}
          </span>
        )
      },
    },
    {
      key: 'period',
      header: 'Period',
      renderCell: (exp) => {
        const end = exp.currentlyWorking
          ? 'Present'
          : exp.endDate
          ? formatDate(exp.endDate)
          : '—'
        return (
          <span style={{ fontSize: '0.8125rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
            {formatDate(exp.startDate)} – {end}
          </span>
        )
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      renderCell: (exp) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <Button variant="secondary" size="small" onClick={() => onEdit(exp)}>
            Edit
          </Button>
          <Button variant="danger" size="small" onClick={() => onDelete(exp)}>
            Delete
          </Button>
        </div>
      ),
    },
  ]
}
