/*
 * MessageDetailsModal Component
 *
 * Modal component for reading visitor message contents in full detail.
 * Composes shared Modal primitive (Layer 4 — Presentation Layer).
 */

import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type { Message } from '@/domain/messages'

interface MessageDetailsModalProps {
  message: Message | null
  isOpen: boolean
  onClose: () => void
  onToggleStatus: (message: Message) => void
  onDelete: (message: Message) => void
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    })
  } catch {
    return dateStr
  }
}

export function MessageDetailsModal({
  message,
  isOpen,
  onClose,
  onToggleStatus,
  onDelete,
}: MessageDetailsModalProps) {
  if (!message) return null

  const isUnread = message.status === 'UNREAD'

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="600px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#38bdf8', fontWeight: 600 }}>
            Contact Message
          </span>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#f8fafc', margin: '0.25rem 0 0 0' }}>
            {message.subject}
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', padding: '0.875rem 1rem', backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: '0.375rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9375rem' }}>
              {message.senderName}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {formatDate(message.createdAt)}
            </span>
          </div>
          <a
            href={`mailto:${message.senderEmail}`}
            style={{ fontSize: '0.8125rem', color: '#38bdf8', textDecoration: 'none' }}
          >
            {message.senderEmail}
          </a>
        </div>

        <div style={{ padding: '1rem', backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '0.375rem', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#e2e8f0', fontSize: '0.9375rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', minHeight: '120px' }}>
          {message.content}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Button variant="danger" size="small" onClick={() => { onDelete(message); onClose() }}>
            Delete Message
          </Button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="secondary" size="small" onClick={() => onToggleStatus(message)}>
              Mark as {isUnread ? 'Read' : 'Unread'}
            </Button>
            <Button variant="primary" size="small" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}