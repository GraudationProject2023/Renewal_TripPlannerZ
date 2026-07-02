'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  companionApplicationApi,
  companionKeys,
  type ApplicationCreateInput,
} from '../../../entities/companion'

export const useApplyCompanion = (companionId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ApplicationCreateInput) =>
      companionApplicationApi.apply(companionId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companionKeys.applications(companionId) })
      queryClient.invalidateQueries({ queryKey: companionKeys.detail(companionId) })
    },
  })
}
