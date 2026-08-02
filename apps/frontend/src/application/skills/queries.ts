/*
 * Skills Application Server State Hooks
 *
 * TanStack Query hooks for skills CRUD operations.
 * Connected to Layer 1 skillsApi transport and Layer 3 domain mappers.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type {
  CreateSkillFormData,
  Skill,
  UpdateSkillFormData,
} from '@/domain/skills'
import {
  createSkillApi,
  deleteSkillApi,
  fetchSkillsApi,
  updateSkillApi,
} from '@/infrastructure/skills'

import { queryKeys } from '../query/keys'

export function useSkills() {
  return useQuery<Skill[]>({
    queryKey: queryKeys.skills.all,
    queryFn: fetchSkillsApi,
  })
}

export function useCreateSkill() {
  const queryClient = useQueryClient()

  return useMutation<Skill, Error, CreateSkillFormData>({
    mutationFn: createSkillApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.skills.all })
    },
  })
}

export function useUpdateSkill() {
  const queryClient = useQueryClient()

  return useMutation<Skill, Error, { id: string; data: UpdateSkillFormData }>({
    mutationFn: ({ id, data }) => updateSkillApi(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.skills.all })
    },
  })
}

export function useDeleteSkill() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: deleteSkillApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.skills.all })
    },
  })
}