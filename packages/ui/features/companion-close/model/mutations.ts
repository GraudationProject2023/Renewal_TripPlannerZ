'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { companionApi, companionKeys } from '../../../entities/companion'

export const useCloseCompanion = (companionId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => companionApi.close(companionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companionKeys.detail(companionId) })
      queryClient.invalidateQueries({ queryKey: companionKeys.lists() })
    },
  })
}
