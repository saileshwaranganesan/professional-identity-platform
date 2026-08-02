/*
 * Education Management Admin Route Component
 *
 * Full Education Management CRUD implementation.
 * Assembles PageHeader, SearchInput, DataTable, Pagination, EmptyState, ErrorAlert,
 * ConfirmDialog, and EducationFormModal. Mirrors AdminProjectsPage, AdminExperiencePage, and AdminSkillsPage.
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
  useEducations,
  useCreateEducation,
  useUpdateEducation,
  useDeleteEducation,
} from '@/application/education'
import type { CreateEducationFormData, Education } from '@/domain/education'
import {
  createEducationColumns,
  EducationFormModal,
} from '@/features/education'

export function AdminEducationPage() {
  const { data: educations = [], isLoading, isError, error, refetch } = useEducations()

  const createMutation = useCreateEducation()
  const updateMutation = useUpdateEducation()
  const deleteMutation = useDeleteEducation()

  // Modal state
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 300)

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingEducation, setEditingEducation] = useState<Education | null>(null)
  const [deleteTargetEducation, setDeleteTargetEducation] = useState<Education | null>(null)

  // Handlers
  const handleOpenCreate = () => {
    setEditingEducation(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEdit = (education: Education) => {
    setEditingEducation(education)
    setIsFormModalOpen(true)
  }

  const handleOpenDelete = (education: Education) => {
    setDeleteTargetEducation(education)
  }

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false)
    setEditingEducation(null)
  }

  const handleCloseDeleteModal = () => {
    setDeleteTargetEducation(null)
  }

  // CRUD Actions
  const handleFormSubmit = async (formData: CreateEducationFormData) => {
    if (editingEducation) {
      await updateMutation.mutateAsync({ id: editingEducation.id, data: formData })
    } else {
      await createMutation.mutateAsync(formData)
    }
    handleCloseFormModal()
  }

  const handleConfirmDelete = async () => {
    if (deleteTargetEducation) {
      await deleteMutation.mutateAsync(deleteTargetEducation.id)
      handleCloseDeleteModal()
    }
  }

  // Filter by institution, degree, or fieldOfStudy
  const filteredEducations = useMemo(() => {
    if (!debouncedSearch.trim()) return educations
    const q = debouncedSearch.toLowerCase()
    return educations.filter(
      (e) =>
        e.institution.toLowerCase().includes(q) ||
        e.degree.toLowerCase().includes(q) ||
        (e.fieldOfStudy && e.fieldOfStudy.toLowerCase().includes(q)),
    )
  }, [educations, debouncedSearch])

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
  } = useClientPagination({ data: filteredEducations, pageSize: 8 })

  // Column definitions
  const columns = useMemo(
    () =>
      createEducationColumns({
        onEdit: handleOpenEdit,
        onDelete: handleOpenDelete,
      }),
    [],
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="Education Management"
        description="Manage your academic history, degrees, and educational qualifications."
        action={
          <Button variant="primary" size="medium" onClick={handleOpenCreate}>
            + Add Education
          </Button>
        }
      />

      {isError && (
        <ErrorAlert
          message={error instanceof Error ? error.message : 'Failed to load education records from backend.'}
          onRetry={() => void refetch()}
        />
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by institution, degree, or field of study..."
        />
      </div>

      <DataTable
        data={paginatedData}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            title={debouncedSearch ? 'No matching education records found' : 'No education records created yet'}
            description={
              debouncedSearch
                ? `No records matched "${debouncedSearch}". Try adjusting your search query.`
                : 'Get started by adding your first education record.'
            }
            action={
              !debouncedSearch ? (
                <Button variant="primary" size="small" onClick={handleOpenCreate}>
                  + Add Education
                </Button>
              ) : undefined
            }
          />
        }
      />

      {!isLoading && !isError && filteredEducations.length > 0 && (
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

      <EducationFormModal
        isOpen={isFormModalOpen}
        initialData={editingEducation}
        onSubmit={handleFormSubmit}
        onClose={handleCloseFormModal}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTargetEducation)}
        title="Delete Education Record"
        message={`Are you sure you want to delete "${deleteTargetEducation?.degree}" at "${deleteTargetEducation?.institution}"? This operation cannot be undone.`}
        confirmLabel="Delete Record"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={() => { void handleConfirmDelete() }}
        onClose={handleCloseDeleteModal}
      />
    </div>
  )
}