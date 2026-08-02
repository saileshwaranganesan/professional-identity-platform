/*
 * Projects Application Server State Hooks
 *
 * TanStack Query hooks for projects CRUD and status toggles.
 * Connected to Layer 1 projectsApi transport and Layer 3 domain mappers.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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

  return useMutation<Project, Error, CreateProjectFormData>({
    mutationFn: createProjectApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation<Project, Error, { id: string; data: UpdateProjectFormData }>({
    mutationFn: ({ id, data }) => updateProjectApi(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: deleteProjectApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
    },
  })
}

export function useTogglePublishProject() {
  const queryClient = useQueryClient()

  return useMutation<Project, Error, { id: string; published: boolean }>({
    mutationFn: ({ id, published }) => togglePublishProjectApi(id, published),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
    },
  })
}

export function useToggleFeatureProject() {
  const queryClient = useQueryClient()

  return useMutation<Project, Error, { id: string; featured: boolean }>({
    mutationFn: ({ id, featured }) => toggleFeatureProjectApi(id, featured),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
    },
  })
}
