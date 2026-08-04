/*
 * Certifications Management Admin Route Component
 *
 * Full Certifications Management CRUD implementation.
 * Assembles PageHeader, SearchInput, DataTable, Pagination, EmptyState, ErrorAlert,
 * ConfirmDialog, and CertificationFormModal.
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
  useCertifications,
  useCreateCertification,
  useUpdateCertification,
  useDeleteCertification,
} from '@/application/certifications'
import type { Certification, CreateCertificationFormData } from '@/domain/certifications'
import {
  createCertificationColumns,
  CertificationFormModal,
} from '@/features/certifications'

export function AdminCertificationsPage() {
  const { data: certifications = [], isLoading, isError, error, refetch } = useCertifications()

  const createMutation = useCreateCertification()
  const updateMutation = useUpdateCertification()
  const deleteMutation = useDeleteCertification()

  // Search & Modal state
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 300)

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Certification | null>(null)

  // Handlers
  const handleOpenCreate = () => {
    setEditingCertification(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEdit = (item: Certification) => {
    setEditingCertification(item)
    setIsFormModalOpen(true)
  }

  const handleOpenDelete = (item: Certification) => {
    setDeleteTarget(item)
  }

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false)
    setEditingCertification(null)
  }

  const handleCloseDeleteModal = () => {
    setDeleteTarget(null)
  }

  // CRUD Actions
  const handleFormSubmit = async (formData: CreateCertificationFormData) => {
    if (editingCertification) {
      await updateMutation.mutateAsync({ id: editingCertification.id, data: formData })
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

  // Filter by name or organization
  const filteredCertifications = useMemo(() => {
    if (!debouncedSearch.trim()) return certifications
    const q = debouncedSearch.toLowerCase()
    return certifications.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.issuingOrganization.toLowerCase().includes(q) ||
        (c.credentialId && c.credentialId.toLowerCase().includes(q)),
    )
  }, [certifications, debouncedSearch])

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
  } = useClientPagination({ data: filteredCertifications, pageSize: 8 })

  // Column definitions
  const columns = useMemo(
    () =>
      createCertificationColumns({
        onEdit: handleOpenEdit,
        onDelete: handleOpenDelete,
      }),
    [],
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="Certifications & Credentials"
        description="Manage your professional licenses, certificates, and verification links."
        action={
          <Button variant="primary" size="medium" onClick={handleOpenCreate}>
            + Add Certification
          </Button>
        }
      />

      {isError && (
        <ErrorAlert
          message={error instanceof Error ? error.message : 'Failed to load certifications from backend.'}
          onRetry={() => void refetch()}
        />
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by certification name, organization, or credential ID..."
        />
      </div>

      <DataTable
        data={paginatedData}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            title={debouncedSearch ? 'No matching certifications found' : 'No certifications added yet'}
            description={
              debouncedSearch
                ? `No certifications matched "${debouncedSearch}". Try adjusting your search query.`
                : 'Get started by adding your first professional certification.'
            }
            action={
              !debouncedSearch ? (
                <Button variant="primary" size="small" onClick={handleOpenCreate}>
                  + Add Certification
                </Button>
              ) : undefined
            }
          />
        }
      />

      {!isLoading && !isError && filteredCertifications.length > 0 && (
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

      <CertificationFormModal
        isOpen={isFormModalOpen}
        initialData={editingCertification}
        onSubmit={handleFormSubmit}
        onClose={handleCloseFormModal}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Certification"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This operation cannot be undone.`}
        confirmLabel="Delete Certification"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={() => { void handleConfirmDelete() }}
        onClose={handleCloseDeleteModal}
      />
    </div>
  )
}
