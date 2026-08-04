import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { ReactNode } from 'react'

import {
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useTogglePublishProject,
  useToggleFeatureProject,
} from './queries'
import { queryKeys } from '../query/keys'
import type { Project } from '@/domain/projects'

const mockCreateProjectApi = vi.fn()
const mockUpdateProjectApi = vi.fn()
const mockDeleteProjectApi = vi.fn()
const mockTogglePublishProjectApi = vi.fn()
const mockToggleFeatureProjectApi = vi.fn()

vi.mock('@/infrastructure/projects', () => ({
  createProjectApi: (data: unknown) => mockCreateProjectApi(data),
  updateProjectApi: (id: string, data: unknown) => mockUpdateProjectApi(id, data),
  deleteProjectApi: (id: string) => mockDeleteProjectApi(id),
  togglePublishProjectApi: (id: string, published: boolean) =>
    mockTogglePublishProjectApi(id, published),
  toggleFeatureProjectApi: (id: string, featured: boolean) =>
    mockToggleFeatureProjectApi(id, featured),
  fetchProjectsApi: vi.fn(),
}))

vi.mock('@/components/ui/Toast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}))

describe('Project Mutations Cache Synchronization', () => {
  let queryClient: QueryClient

  const mockProject: Project = {
    id: 'proj-1',
    title: 'Test Project',
    slug: 'test-project',
    description: 'Project description',
    status: 'COMPLETED',
    published: true,
    featured: true,
    technologies: [],
    highlights: [],
    blocks: [],
  }

  const createWrapper = () => {
    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })
    vi.clearAllMocks()
  })

  it('invalidates both projects and portfolio query keys on project creation', async () => {
    mockCreateProjectApi.mockResolvedValueOnce(mockProject)
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useCreateProject(), { wrapper: createWrapper() })

    await act(async () => {
      await result.current.mutateAsync({
        title: 'New Project',
        slug: 'new-project',
        shortDescription: 'Short desc',
        description: 'Detailed description',
        status: 'IN_PROGRESS',
        featured: false,
        published: true,
        highlights: [],
        blocks: [],
      })
    })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: queryKeys.projects.all })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['portfolio'] })
  })

  it('invalidates both projects and portfolio query keys on project update', async () => {
    mockUpdateProjectApi.mockResolvedValueOnce(mockProject)
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useUpdateProject(), { wrapper: createWrapper() })

    await act(async () => {
      await result.current.mutateAsync({
        id: 'proj-1',
        data: {
          title: 'Updated',
          slug: 'updated',
          description: 'Updated description',
          status: 'COMPLETED',
          featured: true,
          published: true,
          highlights: [],
          blocks: [],
        },
      })
    })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: queryKeys.projects.all })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['portfolio'] })
  })

  it('invalidates both projects and portfolio query keys on project deletion', async () => {
    mockDeleteProjectApi.mockResolvedValueOnce(undefined)
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useDeleteProject(), { wrapper: createWrapper() })

    await act(async () => {
      await result.current.mutateAsync('proj-1')
    })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: queryKeys.projects.all })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['portfolio'] })
  })

  it('invalidates both projects and portfolio query keys on toggle publish/feature', async () => {
    mockTogglePublishProjectApi.mockResolvedValueOnce(mockProject)
    mockToggleFeatureProjectApi.mockResolvedValueOnce(mockProject)
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result: publishHook } = renderHook(() => useTogglePublishProject(), {
      wrapper: createWrapper(),
    })
    const { result: featureHook } = renderHook(() => useToggleFeatureProject(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await publishHook.current.mutateAsync({ id: 'proj-1', published: false })
      await featureHook.current.mutateAsync({ id: 'proj-1', featured: false })
    })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: queryKeys.projects.all })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['portfolio'] })
  })
})

