/*
 * Achievements Management Admin Route Component
 *
 * Full Achievements Management CRUD implementation.
 * Assembles PageHeader, SearchInput, DataTable, Pagination, EmptyState, ErrorAlert,
 * ConfirmDialog, and AchievementFormModal.
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
  useAchievements,
  useCreateAchievement,
  useUpdateAchievement,
  useDeleteAchievement,
} from '@/application/achievements'
import type { Achievement, CreateAchievementFormData } from '@/domain/achievements'
import {
  createAchievementColumns,
  AchievementFormModal,
} from '@/features/achievements'

export function AdminAchievementsPage() {
  const { data: achievements = [], isLoading, isError, error, refetch } = useAchievements()

  const createMutation = useCreateAchievement()
  const updateMutation = useUpdateAchievement()
  const deleteMutation = useDeleteAchievement()

  // Search & Modal state
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 300)

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Achievement | null>(null)

  // Handlers
  const handleOpenCreate = () => {
    setEditingAchievement(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEdit = (item: Achievement) => {
    setEditingAchievement(item)
    setIsFormModalOpen(true)
  }

  const handleOpenDelete = (item: Achievement) => {
    setDeleteTarget(item)
  }

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false)
    setEditingAchievement(null)
  }

  const handleCloseDeleteModal = () => {
    setDeleteTarget(null)
  }

  // CRUD Actions
  const handleFormSubmit = async (formData: CreateAchievementFormData) => {
    if (editingAchievement) {
      await updateMutation.mutateAsync({ id: editingAchievement.id, data: formData })
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

  // Filter by title or organization
  const filteredAchievements = useMemo(() => {
    if (!debouncedSearch.trim()) return achievements
    const q = debouncedSearch.toLowerCase()
    return achievements.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.organization && a.organization.toLowerCase().includes(q)) ||
        (a.description && a.description.toLowerCase().includes(q)),
    )
  }, [achievements, debouncedSearch])

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
  } = useClientPagination({ data: filteredAchievements, pageSize: 8 })

  // Column definitions
  const columns = useMemo(
    () =>
      createAchievementColumns({
        onEdit: handleOpenEdit,
        onDelete: handleOpenDelete,
      }),
    [],
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="Honors & Achievements"
        description="Manage your awards, speaking engagements, key milestones, and recognitions."
        action={
          <Button variant="primary" size="medium" onClick={handleOpenCreate}>
            + Add Achievement
          </Button>
        }
      />

      {isError && (
        <ErrorAlert
          message={error instanceof Error ? error.message : 'Failed to load achievements from backend.'}
          onRetry={() => void refetch()}
        />
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by title, organization, or description..."
        />
      </div>

      <DataTable
        data={paginatedData}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            title={debouncedSearch ? 'No matching achievements found' : 'No achievements added yet'}
            description={
              debouncedSearch
                ? `No achievements matched "${debouncedSearch}". Try adjusting your search query.`
                : 'Get started by adding your first honor or achievement.'
            }
            action={
              !debouncedSearch ? (
                <Button variant="primary" size="small" onClick={handleOpenCreate}>
                  + Add Achievement
                </Button>
              ) : undefined
            }
          />
        }
      />

      {!isLoading && !isError && filteredAchievements.length > 0 && (
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

      <AchievementFormModal
        isOpen={isFormModalOpen}
        initialData={editingAchievement}
        onSubmit={handleFormSubmit}
        onClose={handleCloseFormModal}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Achievement"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This operation cannot be undone.`}
        confirmLabel="Delete Achievement"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={() => { void handleConfirmDelete() }}
        onClose={handleCloseDeleteModal}
      />
    </div>
  )
}
