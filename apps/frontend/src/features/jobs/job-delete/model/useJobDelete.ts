import { useApiClient } from '@/shared/lib/api-client'
import { useAsyncOperation } from '@/shared/lib/async-operation'

export function useJobDelete() {
  const apiClient = useApiClient()

  async function jobDelete(jobId: string) {
    return await apiClient.jobs.jobsDelete(jobId)
  }

  const {
    call: deleteJob,
    error: deleteJobError,
    loading: loadingDeleteJob,
  } = useAsyncOperation(jobDelete)

  return {
    jobDelete,
    deleteJob,
    deleteJobError,
    loadingDeleteJob,
  }
}
