/*
 * Projects Management Admin Route Component
 *
 * Full Projects Management CRUD reference implementation.
 * Assembles PageHeader, SearchInput, DataTable, Pagination, EmptyState, ErrorAlert,
 * ConfirmDialog, and ProjectFormModal.
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
  useCreateProject,
  useDeleteProject,
  useProjects,
  useToggleFeatureProject,
  useTogglePublishProject,
  useUpdateProject,
} from '@/application/projects'
import type { CreateProjectFormData, Project } from '@/domain/projects'
import {
  createProjectColumns,
  ProjectFormModal,
} from '@/features/projects'

export function AdminProjectsPage() {
  const { data: projects = [], isLoading, isError, error, refetch } = useProjects()

  const createMutation = useCreateProject()
  const updateMutation = useUpdateProject()
  const deleteMutation = useDeleteProject()
  const togglePublishMutation = useTogglePublishProject()
  const toggleFeatureMutation = useToggleFeatureProject()

  // State management for modals
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 300)

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const [deleteTargetProject, setDeleteTargetProject] = useState<Project | null>(null)

  // Handlers for modal triggers
  const handleOpenCreate = () => {
    setEditingProject(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project)
    setIsFormModalOpen(true)
  }

  const handleOpenDelete = (project: Project) => {
    setDeleteTargetProject(project)
  }

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false)
    setEditingProject(null)
  }

  const handleCloseDeleteModal = () => {
    setDeleteTargetProject(null)
  }

  // CRUD Actions
  const handleFormSubmit = async (formData: CreateProjectFormData) => {
    if (editingProject) {
      await updateMutation.mutateAsync({ id: editingProject.id, data: formData })
    } else {
      await createMutation.mutateAsync(formData)
    }
    handleCloseFormModal()
  }

  const handleConfirmDelete = async () => {
    if (deleteTargetProject) {
      await deleteMutation.mutateAsync(deleteTargetProject.id)
      handleCloseDeleteModal()
    }
  }

  const handleTogglePublish = async (project: Project) => {
    await togglePublishMutation.mutateAsync({
      id: project.id,
      published: !project.published,
    })
  }

  const handleToggleFeature = async (project: Project) => {
    await toggleFeatureMutation.mutateAsync({
      id: project.id,
      featured: !project.featured,
    })
  }

  // Filter projects based on debounced search query
  const filteredProjects = useMemo(() => {
    if (!debouncedSearch.trim()) return projects
    const q = debouncedSearch.toLowerCase()
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.headline && p.headline.toLowerCase().includes(q)),
    )
  }, [projects, debouncedSearch])

  // Pagination hook
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
  } = useClientPagination({ data: filteredProjects, pageSize: 8 })

  // Column definitions
  const columns = useMemo(
    () =>
      createProjectColumns({
        onEdit: handleOpenEdit,
        onDelete: handleOpenDelete,
        onTogglePublish: (p) => { void handleTogglePublish(p) },
        onToggleFeature: (p) => { void handleToggleFeature(p) },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="Projects Management"
        description="Manage, feature, and publish software portfolio projects."
        action={
          <Button variant="primary" size="medium" onClick={handleOpenCreate}>
            + Create Project
          </Button>
        }
      />

      {isError && (
        <ErrorAlert
          message={error instanceof Error ? error.message : 'Failed to load projects from backend.'}
          onRetry={() => void refetch()}
        />
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by title, slug, or headline..."
        />
      </div>

      <DataTable
        data={paginatedData}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            title={debouncedSearch ? 'No matching projects found' : 'No projects created yet'}
            description={
              debouncedSearch
                ? `No projects matched "${debouncedSearch}". Try adjusting your search query.`
                : 'Get started by creating your first portfolio project.'
            }
            action={
              !debouncedSearch ? (
                <Button variant="primary" size="small" onClick={handleOpenCreate}>
                  + Create Project
                </Button>
              ) : undefined
            }
          />
        }
      />

      {!isLoading && !isError && filteredProjects.length > 0 && (
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

      <ProjectFormModal
        isOpen={isFormModalOpen}
        initialData={editingProject}
        onSubmit={handleFormSubmit}
        onClose={handleCloseFormModal}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTargetProject)}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTargetProject?.title}"? This operation cannot be undone.`}
        confirmLabel="Delete Project"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={() => { void handleConfirmDelete() }}
        onClose={handleCloseDeleteModal}
      />
    </div>
  )
}
