/*
 * Projects Application Server State Hooks
 *
 * TanStack Query hooks for projects CRUD and status toggles.
 * Connected to Layer 1 projectsApi transport and Layer 3 domain mappers.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useToast } from '@/components/ui/Toast'
import type { CreateProjectFormData, Project, UpdateProjectFormData } from '@/domain/projects'
import {
  createProjectApi,
  deleteProjectApi,
  fetchProjectsApi,
  toggleFeatureProjectApi,
  togglePublishProjectApi,
  updateProjectApi,
} from '@/infrastructure/projects'

import { queryKeys } from '../query/keys'

export function useProjects() {
  return useQuery<Project[]>({
    queryKey: queryKeys.projects.all,
    queryFn: fetchProjectsApi,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation<Project, Error, CreateProjectFormData>({
    mutationFn: createProjectApi,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.projects.all }),
        queryClient.invalidateQueries({ queryKey: ['portfolio'] }),
      ])
      toast.success('Project created successfully.')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create project.')
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation<Project, Error, { id: string; data: UpdateProjectFormData }>({
    mutationFn: ({ id, data }) => updateProjectApi(id, data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.projects.all }),
        queryClient.invalidateQueries({ queryKey: ['portfolio'] }),
      ])
      toast.success('Project updated successfully.')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update project.')
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation<void, Error, string>({
    mutationFn: deleteProjectApi,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.projects.all }),
        queryClient.invalidateQueries({ queryKey: ['portfolio'] }),
      ])
      toast.success('Project deleted successfully.')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete project.')
    },
  })
}

export function useTogglePublishProject() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation<Project, Error, { id: string; published: boolean }>({
    mutationFn: ({ id, published }) => togglePublishProjectApi(id, published),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.projects.all }),
        queryClient.invalidateQueries({ queryKey: ['portfolio'] }),
      ])
      toast.success('Project status updated successfully.')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to toggle project publish status.')
    },
  })
}

export function useToggleFeatureProject() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation<Project, Error, { id: string; featured: boolean }>({
    mutationFn: ({ id, featured }) => toggleFeatureProjectApi(id, featured),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.projects.all }),
        queryClient.invalidateQueries({ queryKey: ['portfolio'] }),
      ])
      toast.success('Project showcase status updated successfully.')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to toggle project feature status.')
    },
  })
}


