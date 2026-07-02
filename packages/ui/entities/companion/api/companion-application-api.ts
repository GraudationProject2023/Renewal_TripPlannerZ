import { apiGet, apiPatch, apiPost } from '../../../shared/api'
import type { CompanionApplication } from '../model/types'

export interface ApplicationCreateInput {
  message?: string | null
}

export const companionApplicationApi = {
  list: (companionId: number) =>
    apiGet<CompanionApplication[]>(`/companions/${companionId}/applications`),
  apply: (companionId: number, input: ApplicationCreateInput) =>
    apiPost<CompanionApplication>(`/companions/${companionId}/applications`, input),
  accept: (companionId: number, applicationId: number) =>
    apiPatch<CompanionApplication>(
      `/companions/${companionId}/applications/${applicationId}/accept`,
    ),
  reject: (companionId: number, applicationId: number) =>
    apiPatch<CompanionApplication>(
      `/companions/${companionId}/applications/${applicationId}/reject`,
    ),
}
