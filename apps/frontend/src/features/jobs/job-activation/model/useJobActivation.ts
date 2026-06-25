import { useApiClient } from '@/shared/lib/api-client'
import { useAsyncOperation } from '@/shared/lib/async-operation'

export function useJobActivation() {
  const apiClient = useApiClient()

  async function jobActivation(jobId: string) {
    return await apiClient.jobs.jobsActivationDetail(jobId)
  }

  const {
    call: activateJob,
    error: activateJobError,
    loading: loadingActivateJob,
  } = useAsyncOperation(jobActivation)

  return {
    jobActivation,
    activateJob,
    activateJobError,
    loadingActivateJob,
  }
}
