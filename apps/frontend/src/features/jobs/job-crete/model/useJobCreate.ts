import { useApiClient } from '@/shared/lib/api-client'
import { useAsyncOperation } from '@/shared/lib/async-operation'

export function useJobCreate() {
  const apiClient = useApiClient()

  async function createFeature(urls: string[]) {
    return await apiClient.jobs.jobsCreate({ urls })
  }

  const {
    call: createJobCall,
    error: createJobError,
    loading: loadingCreateJob,
    errorMessage: createJobErrorMessage,
  } = useAsyncOperation(createFeature)

  return {
    createFeature,
    createJobCall,
    createJobError,
    loadingCreateJob,
    createJobErrorMessage,
  }
}
