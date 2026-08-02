/*
 * Skills DataTable Column Definitions
 *
 * Strongly-typed ColumnDef<Skill>[] configuration for Skills DataTable.
 * Render name, category, proficiency level badge, display order, and action buttons.
 */

import { Button } from '@/components/ui/Button'
import type { ColumnDef } from '@/components/crud'
import type { Skill, SkillLevel } from '@/domain/skills'

interface CreateSkillColumnsOptions {
  onEdit: (skill: Skill) => void
  onDelete: (skill: Skill) => void
}

const levelBadgeStyles: Record<SkillLevel, { bg: string; color: string; label: string }> = {
  EXPERT: { bg: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', label: 'Expert' },
  ADVANCED: { bg: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', label: 'Advanced' },
  INTERMEDIATE: { bg: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', label: 'Intermediate' },
  BEGINNER: { bg: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', label: 'Beginner' },
}

export function createSkillColumns({
  onEdit,
  onDelete,
}: CreateSkillColumnsOptions): ColumnDef<Skill>[] {
  return [
    {
      key: 'name',
      header: 'Skill Name',
      renderCell: (skill) => (
        <span style={{ fontWeight: 600, color: '#f8fafc' }}>{skill.name}</span>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      renderCell: (skill) => (
        <span style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>
          {skill.category || 'Uncategorized'}
        </span>
      ),
    },
    {
      key: 'level',
      header: 'Proficiency Level',
      align: 'center',
      renderCell: (skill) => {
        const badge = levelBadgeStyles[skill.level] ?? levelBadgeStyles.BEGINNER
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
      key: 'displayOrder',
      header: 'Display Order',
      align: 'center',
      renderCell: (skill) => (
        <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
          {skill.displayOrder}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      renderCell: (skill) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <Button variant="secondary" size="small" onClick={() => onEdit(skill)}>
            Edit
          </Button>
          <Button variant="danger" size="small" onClick={() => onDelete(skill)}>
            Delete
          </Button>
        </div>
      ),
    },
  ]
}