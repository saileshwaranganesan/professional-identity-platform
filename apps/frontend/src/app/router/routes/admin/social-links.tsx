/*
 * Social Links Management Admin Route Component
 *
 * Full Social Links Management CRUD implementation.
 * Assembles PageHeader, SearchInput, DataTable, Pagination, EmptyState, ErrorAlert,
 * ConfirmDialog, and SocialLinkFormModal.
 */

import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/Button'
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
  useSocialLinks,
  useCreateSocialLink,
  useUpdateSocialLink,
  useDeleteSocialLink,
} from '@/application/socialLinks'
import type { CreateSocialLinkFormData, SocialLink } from '@/domain/socialLinks'
import {
  createSocialLinkColumns,
  SocialLinkFormModal,
} from '@/features/socialLinks'

export function AdminSocialLinksPage() {
  const { data: socialLinks = [], isLoading, isError, error, refetch } = useSocialLinks()

  const createMutation = useCreateSocialLink()
  const updateMutation = useUpdateSocialLink()
  const deleteMutation = useDeleteSocialLink()

  // Search & Modal state
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 300)

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingSocialLink, setEditingSocialLink] = useState<SocialLink | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<SocialLink | null>(null)

  // Handlers
  const handleOpenCreate = () => {
    setEditingSocialLink(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEdit = (item: SocialLink) => {
    setEditingSocialLink(item)
    setIsFormModalOpen(true)
  }

  const handleOpenDelete = (item: SocialLink) => {
    setDeleteTarget(item)
  }

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false)
    setEditingSocialLink(null)
  }

  const handleCloseDeleteModal = () => {
    setDeleteTarget(null)
  }

  // CRUD Actions
  const handleFormSubmit = async (formData: CreateSocialLinkFormData) => {
    if (editingSocialLink) {
      await updateMutation.mutateAsync({ id: editingSocialLink.id, data: formData })
    } else {
      await createMutation.mutateAsync(formData)
    }
    handleCloseFormModal()
  }

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await deleteMutation.mutateAsync(deleteTarget.id)
      handleCloseDeleteModal()
    }
  }

  // Filter by platform or URL
  const filteredSocialLinks = useMemo(() => {
    if (!debouncedSearch.trim()) return socialLinks
    const q = debouncedSearch.toLowerCase()
    return socialLinks.filter(
      (s) =>
        s.platform.toLowerCase().includes(q) ||
        s.url.toLowerCase().includes(q),
    )
  }, [socialLinks, debouncedSearch])

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
  } = useClientPagination({ data: filteredSocialLinks, pageSize: 8 })

  // Column definitions
  const columns = useMemo(
    () =>
      createSocialLinkColumns({
        onEdit: handleOpenEdit,
        onDelete: handleOpenDelete,
      }),
    [],
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="Social Profiles & Media Links"
        description="Manage external social media handles, portfolio links, and developer platform URLs."
        action={
          <Button variant="primary" size="medium" onClick={handleOpenCreate}>
            + Add Social Link
          </Button>
        }
      />

      {isError && (
        <ErrorAlert
          message={error instanceof Error ? error.message : 'Failed to load social links from backend.'}
          onRetry={() => void refetch()}
        />
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by platform name or URL..."
        />
      </div>

      <DataTable
        data={paginatedData}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            title={debouncedSearch ? 'No matching social links found' : 'No social links added yet'}
            description={
              debouncedSearch
                ? `No social links matched "${debouncedSearch}". Try adjusting your search query.`
                : 'Get started by adding your first social media link or developer profile.'
            }
            action={
              !debouncedSearch ? (
                <Button variant="primary" size="small" onClick={handleOpenCreate}>
                  + Add Social Link
                </Button>
              ) : undefined
            }
          />
        }
      />

      {!isLoading && !isError && filteredSocialLinks.length > 0 && (
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

      <SocialLinkFormModal
        isOpen={isFormModalOpen}
        initialData={editingSocialLink}
        onSubmit={handleFormSubmit}
        onClose={handleCloseFormModal}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Social Link"
        message={`Are you sure you want to delete the ${deleteTarget?.platform} link? This operation cannot be undone.`}
        confirmLabel="Delete Link"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={() => { void handleConfirmDelete() }}
        onClose={handleCloseDeleteModal}
      />
    </div>
  )
}
