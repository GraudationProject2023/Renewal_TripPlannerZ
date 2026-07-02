'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  companionApplicationApi,
  companionKeys,
} from '../../../entities/companion'

export const useAcceptApplication = (companionId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (applicationId: number) =>
      companionApplicationApi.accept(companionId, applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companionKeys.applications(companionId) })
      queryClient.invalidateQueries({ queryKey: companionKeys.detail(companionId) })
    },
  })
}

export const useRejectApplication = (companionId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (applicationId: number) =>
      companionApplicationApi.reject(companionId, applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companionKeys.applications(companionId) })
    },
  })
}
