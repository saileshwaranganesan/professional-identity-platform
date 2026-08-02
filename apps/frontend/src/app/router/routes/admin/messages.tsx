/*
 * Contact Messages Admin Route Component
 *
 * Full Visitor Messages Inbox & Management implementation.
 * Assembles PageHeader, SearchInput, DataTable, Pagination, EmptyState, ErrorAlert,
 * ConfirmDialog, and MessageDetailsModal.
 */

import { useMemo, useState } from 'react'

import {
  ConfirmDialog,
  DataTable,
  EmptyState,
  ErrorAlert,
  PageHeader,
  Pagination,
  SearchInput,
} from '@/components/crud'
import {
  useClientPagination,
  useDebounce,
} from '@/application/crud'
import {
  useDeleteMessage,
  useMessages,
  useUpdateMessageStatus,
} from '@/application/messages'
import type { Message } from '@/domain/messages'
import {
  createMessageColumns,
  MessageDetailsModal,
  mockMessages,
} from '@/features/messages'

export function AdminMessagesPage() {
  const { data: serverMessages, isLoading, isError, error, refetch } = useMessages()

  // Use server messages if array returned, fallback to mockMessages for dev inbox preview
  const messages = Array.isArray(serverMessages) && serverMessages.length > 0 ? serverMessages : mockMessages

  const updateStatusMutation = useUpdateMessageStatus()
  const deleteMutation = useDeleteMessage()

  // Modal states
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 300)

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [deleteTargetMessage, setDeleteTargetMessage] = useState<Message | null>(null)

  // Handlers
  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message)
    if (message.status === 'UNREAD') {
      void updateStatusMutation.mutateAsync({ id: message.id, status: 'READ' })
    }
  }

  const handleToggleStatus = async (message: Message) => {
    const nextStatus = message.status === 'UNREAD' ? 'READ' : 'UNREAD'
    await updateStatusMutation.mutateAsync({ id: message.id, status: nextStatus })
    if (selectedMessage?.id === message.id) {
      setSelectedMessage((prev) => (prev ? { ...prev, status: nextStatus } : null))
    }
  }

  const handleOpenDelete = (message: Message) => {
    setDeleteTargetMessage(message)
  }

  const handleCloseDetailsModal = () => {
    setSelectedMessage(null)
  }

  const handleCloseDeleteModal = () => {
    setDeleteTargetMessage(null)
  }

  const handleConfirmDelete = async () => {
    if (deleteTargetMessage) {
      await deleteMutation.mutateAsync(deleteTargetMessage.id)
      handleCloseDeleteModal()
    }
  }

  // Filter by sender name, email, or subject
  const filteredMessages = useMemo(() => {
    if (!debouncedSearch.trim()) return messages
    const q = debouncedSearch.toLowerCase()
    return messages.filter(
      (m) =>
        m.senderName.toLowerCase().includes(q) ||
        m.senderEmail.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.content.toLowerCase().includes(q),
    )
  }, [messages, debouncedSearch])

  // Pagination
  const {
    page,
    pageSize,
    totalPages,
    totalItems,
    paginatedData,
    nextPage,
    prevPage,
    canNextPage,
    canPrevPage,
  } = useClientPagination({ data: filteredMessages, pageSize: 8 })

  // Column definitions
  const columns = useMemo(
    () =>
      createMessageColumns({
        onView: handleViewMessage,
        onToggleStatus: (m) => { void handleToggleStatus(m) },
        onDelete: handleOpenDelete,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="Contact Messages Inbox"
        description="View and respond to incoming contact submissions from website visitors."
      />

      {isError && (
        <ErrorAlert
          message={error instanceof Error ? error.message : 'Failed to load messages from backend.'}
          onRetry={() => void refetch()}
        />
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by sender, email, subject, or message text..."
        />
      </div>

      <DataTable
        data={paginatedData}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            title={debouncedSearch ? 'No matching messages found' : 'Inbox is empty'}
            description={
              debouncedSearch
                ? `No messages matched "${debouncedSearch}". Try adjusting your search query.`
                : 'No contact form submissions received yet.'
            }
          />
        }
      />

      {!isLoading && !isError && filteredMessages.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onNextPage={nextPage}
          onPrevPage={prevPage}
          canNextPage={canNextPage}
          canPrevPage={canPrevPage}
        />
      )}

      <MessageDetailsModal
        message={selectedMessage}
        isOpen={Boolean(selectedMessage)}
        onClose={handleCloseDetailsModal}
        onToggleStatus={(m) => { void handleToggleStatus(m) }}
        onDelete={handleOpenDelete}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTargetMessage)}
        title="Delete Message"
        message={`Are you sure you want to delete the message from "${deleteTargetMessage?.senderName}" ("${deleteTargetMessage?.subject}")? This operation cannot be undone.`}
        confirmLabel="Delete Message"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={() => { void handleConfirmDelete() }}
        onClose={handleCloseDeleteModal}
      />
    </div>
  )
}