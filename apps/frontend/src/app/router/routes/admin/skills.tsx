/*
 * Skills Management Admin Route Component
 *
 * Full Skills Management CRUD implementation.
 * Assembles PageHeader, SearchInput, DataTable, Pagination, EmptyState, ErrorAlert,
 * ConfirmDialog, and SkillFormModal. Mirrors AdminProjectsPage and AdminExperiencePage.
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
  useSkills,
  useCreateSkill,
  useUpdateSkill,
  useDeleteSkill,
} from '@/application/skills'
import type { CreateSkillFormData, Skill } from '@/domain/skills'
import {
  createSkillColumns,
  SkillFormModal,
} from '@/features/skills'

export function AdminSkillsPage() {
  const { data: skills = [], isLoading, isError, error, refetch } = useSkills()

  const createMutation = useCreateSkill()
  const updateMutation = useUpdateSkill()
  const deleteMutation = useDeleteSkill()

  // Modal state
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 300)

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [deleteTargetSkill, setDeleteTargetSkill] = useState<Skill | null>(null)

  // Handlers
  const handleOpenCreate = () => {
    setEditingSkill(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEdit = (skill: Skill) => {
    setEditingSkill(skill)
    setIsFormModalOpen(true)
  }

  const handleOpenDelete = (skill: Skill) => {
    setDeleteTargetSkill(skill)
  }

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false)
    setEditingSkill(null)
  }

  const handleCloseDeleteModal = () => {
    setDeleteTargetSkill(null)
  }

  // CRUD Actions
  const handleFormSubmit = async (formData: CreateSkillFormData) => {
    if (editingSkill) {
      await updateMutation.mutateAsync({ id: editingSkill.id, data: formData })
    } else {
      await createMutation.mutateAsync(formData)
    }
    handleCloseFormModal()
  }

  const handleConfirmDelete = async () => {
    if (deleteTargetSkill) {
      await deleteMutation.mutateAsync(deleteTargetSkill.id)
      handleCloseDeleteModal()
    }
  }

  // Filter by name or category
  const filteredSkills = useMemo(() => {
    if (!debouncedSearch.trim()) return skills
    const q = debouncedSearch.toLowerCase()
    return skills.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.category && s.category.toLowerCase().includes(q)) ||
        s.level.toLowerCase().includes(q),
    )
  }, [skills, debouncedSearch])

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
  } = useClientPagination({ data: filteredSkills, pageSize: 8 })

  // Column definitions
  const columns = useMemo(
    () =>
      createSkillColumns({
        onEdit: handleOpenEdit,
        onDelete: handleOpenDelete,
      }),
    [],
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="Skills & Technologies"
        description="Manage your technical skills, proficiency levels, and category groupings."
        action={
          <Button variant="primary" size="medium" onClick={handleOpenCreate}>
            + Add Skill
          </Button>
        }
      />

      {isError && (
        <ErrorAlert
          message={error instanceof Error ? error.message : 'Failed to load skills from backend.'}
          onRetry={() => void refetch()}
        />
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by skill name, category, or level..."
        />
      </div>

      <DataTable
        data={paginatedData}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            title={debouncedSearch ? 'No matching skills found' : 'No skills created yet'}
            description={
              debouncedSearch
                ? `No skills matched "${debouncedSearch}". Try adjusting your search query.`
                : 'Get started by adding your first technical skill.'
            }
            action={
              !debouncedSearch ? (
                <Button variant="primary" size="small" onClick={handleOpenCreate}>
                  + Add Skill
                </Button>
              ) : undefined
            }
          />
        }
      />

      {!isLoading && !isError && filteredSkills.length > 0 && (
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

      <SkillFormModal
        isOpen={isFormModalOpen}
        initialData={editingSkill}
        onSubmit={handleFormSubmit}
        onClose={handleCloseFormModal}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTargetSkill)}
        title="Delete Skill"
        message={`Are you sure you want to delete "${deleteTargetSkill?.name}"? This operation cannot be undone.`}
        confirmLabel="Delete Skill"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={() => { void handleConfirmDelete() }}
        onClose={handleCloseDeleteModal}
      />
    </div>
  )
}