'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  companionApi,
  companionKeys,
  type CompanionCreateInput,
} from '../../../entities/companion'

export const useCreateCompanion = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CompanionCreateInput) => companionApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companionKeys.lists() })
    },
  })
}
