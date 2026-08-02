/*
 * Messages DataTable Column Definitions
 *
 * Strongly-typed ColumnDef<Message>[] configuration for Messages DataTable.
 * Render sender info, subject, timestamp, status badge, and action triggers.
 */

import { Button } from '@/components/ui/Button'
import type { ColumnDef } from '@/components/crud'
import type { Message, MessageStatus } from '@/domain/messages'

interface CreateMessageColumnsOptions {
  onView: (message: Message) => void
  onToggleStatus: (message: Message) => void
  onDelete: (message: Message) => void
}

const statusBadgeStyles: Record<MessageStatus, { bg: string; color: string; label: string }> = {
  UNREAD: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', label: 'Unread' },
  READ: { bg: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8', label: 'Read' },
  ARCHIVED: { bg: 'rgba(100, 116, 139, 0.15)', color: '#64748b', label: 'Archived' },
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

export function createMessageColumns({
  onView,
  onToggleStatus,
  onDelete,
}: CreateMessageColumnsOptions): ColumnDef<Message>[] {
  return [
    {
      key: 'sender',
      header: 'Sender',
      renderCell: (msg) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: msg.status === 'UNREAD' ? 700 : 500, color: '#f8fafc' }}>
            {msg.senderName}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{msg.senderEmail}</span>
        </div>
      ),
    },
    {
      key: 'subject',
      header: 'Subject',
      renderCell: (msg) => (
        <span
          style={{
            fontWeight: msg.status === 'UNREAD' ? 600 : 400,
            color: msg.status === 'UNREAD' ? '#f8fafc' : '#cbd5e1',
          }}
        >
          {msg.subject}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Received Date',
      renderCell: (msg) => (
        <span style={{ fontSize: '0.8125rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
          {formatDate(msg.createdAt)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      renderCell: (msg) => {
        const badge = statusBadgeStyles[msg.status] ?? statusBadgeStyles.UNREAD
        return (
          <button
            type="button"
            onClick={() => onToggleStatus(msg)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
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
          </button>
        )
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      renderCell: (msg) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <Button variant="secondary" size="small" onClick={() => onView(msg)}>
            View
          </Button>
          <Button variant="danger" size="small" onClick={() => onDelete(msg)}>
            Delete
          </Button>
        </div>
      ),
    },
  ]
}