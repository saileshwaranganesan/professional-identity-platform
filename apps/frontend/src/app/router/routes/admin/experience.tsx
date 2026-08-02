/*
 * Experience Management Admin Route Component
 *
 * Full Experience Management CRUD implementation.
 * Assembles PageHeader, SearchInput, DataTable, Pagination, EmptyState, ErrorAlert,
 * ConfirmDialog, and ExperienceFormModal. Mirrors AdminProjectsPage pattern.
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
  useExperiences,
  useCreateExperience,
  useUpdateExperience,
  useDeleteExperience,
} from '@/application/experience'
import type { CreateExperienceFormData, Experience } from '@/domain/experience'
import {
  createExperienceColumns,
  ExperienceFormModal,
} from '@/features/experience'

export function AdminExperiencePage() {
  const { data: experiences = [], isLoading, isError, error, refetch } = useExperiences()

  const createMutation = useCreateExperience()
  const updateMutation = useUpdateExperience()
  const deleteMutation = useDeleteExperience()

  // Modal state
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 300)

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [deleteTargetExperience, setDeleteTargetExperience] = useState<Experience | null>(null)

  // Handlers
  const handleOpenCreate = () => {
    setEditingExperience(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEdit = (experience: Experience) => {
    setEditingExperience(experience)
    setIsFormModalOpen(true)
  }

  const handleOpenDelete = (experience: Experience) => {
    setDeleteTargetExperience(experience)
  }

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false)
    setEditingExperience(null)
  }

  const handleCloseDeleteModal = () => {
    setDeleteTargetExperience(null)
  }

  // CRUD Actions
  const handleFormSubmit = async (formData: CreateExperienceFormData) => {
    if (editingExperience) {
      await updateMutation.mutateAsync({ id: editingExperience.id, data: formData })
    } else {
      await createMutation.mutateAsync(formData)
    }
    handleCloseFormModal()
  }

  const handleConfirmDelete = async () => {
    if (deleteTargetExperience) {
      await deleteMutation.mutateAsync(deleteTargetExperience.id)
      handleCloseDeleteModal()
    }
  }

  // Filter by company or position
  const filteredExperiences = useMemo(() => {
    if (!debouncedSearch.trim()) return experiences
    const q = debouncedSearch.toLowerCase()
    return experiences.filter(
      (e) =>
        e.company.toLowerCase().includes(q) ||
        e.position.toLowerCase().includes(q) ||
        (e.location && e.location.toLowerCase().includes(q)),
    )
  }, [experiences, debouncedSearch])

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
  } = useClientPagination({ data: filteredExperiences, pageSize: 8 })

  // Column definitions
  const columns = useMemo(
    () =>
      createExperienceColumns({
        onEdit: handleOpenEdit,
        onDelete: handleOpenDelete,
      }),
    [],
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="Experience Management"
        description="Manage your professional work history and career timeline."
        action={
          <Button variant="primary" size="medium" onClick={handleOpenCreate}>
            + Add Experience
          </Button>
        }
      />

      {isError && (
        <ErrorAlert
          message={error instanceof Error ? error.message : 'Failed to load experience from backend.'}
          onRetry={() => void refetch()}
        />
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by company, position, or location..."
        />
      </div>

      <DataTable
        data={paginatedData}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            title={debouncedSearch ? 'No matching experiences found' : 'No experience entries yet'}
            description={
              debouncedSearch
                ? `No entries matched "${debouncedSearch}". Try adjusting your search query.`
                : 'Get started by adding your first work experience entry.'
            }
            action={
              !debouncedSearch ? (
                <Button variant="primary" size="small" onClick={handleOpenCreate}>
                  + Add Experience
                </Button>
              ) : undefined
            }
          />
        }
      />

      {!isLoading && !isError && filteredExperiences.length > 0 && (
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

      <ExperienceFormModal
        isOpen={isFormModalOpen}
        initialData={editingExperience}
        onSubmit={handleFormSubmit}
        onClose={handleCloseFormModal}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTargetExperience)}
        title="Delete Experience"
        message={`Are you sure you want to delete the "${deleteTargetExperience?.position}" entry at "${deleteTargetExperience?.company}"? This operation cannot be undone.`}
        confirmLabel="Delete Experience"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={() => { void handleConfirmDelete() }}
        onClose={handleCloseDeleteModal}
      />
    </div>
  )
}
