import type { Store } from 'pinia'
import type { Ref } from 'vue'
import type {
  JobsListParams,
  JobTask,
  JobTaskDetail,
  PaginatedJobsResponse,
} from '@/shared/generated/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiClient } from '@/shared/lib/api-client'

export type IJobMeta = Omit<PaginatedJobsResponse, 'data'>
export interface IJobsState {
  jobs: Ref<JobTask[]>
  metaJobs: Ref<Omit<PaginatedJobsResponse, 'data'> | null>
  jobDetail: Ref<JobTaskDetail | null>
}

export interface IJobsGetters {}

export interface IJobsActions {
  patchJobs: (data: JobTask[]) => void
  patchJobsMeta: (data: IJobMeta) => void
  fetchJobs: (filter: JobsListParams) => Promise<PaginatedJobsResponse>
  fetchJobDetail: (jobId: string) => Promise<JobTaskDetail | null>
  patchJobDetail: (data: JobTaskDetail | null) => void
  $reset: () => void
}

export interface IJobsStore extends Store<'jobs', IJobsState, IJobsGetters, IJobsActions> {}

export const useJobs: () => IJobsStore = defineStore('jobs', () => {
  const apiClient = useApiClient()

  const jobs = ref<JobTask[]>([])
  const jobDetail = ref<JobTaskDetail | null>(null)
  const metaJobs = ref<IJobMeta | null>(null)

  function patchJobs(data: JobTask[]) {
    jobs.value = data
  }

  function patchJobDetail(data: JobTaskDetail | null) {
    jobDetail.value = data
  }
  function patchJobsMeta(data: IJobMeta) {
    metaJobs.value = data
  }

  async function fetchJobs(filter: JobsListParams): Promise<PaginatedJobsResponse> {
    const { data } = await apiClient.jobs.jobsList(filter)

    patchJobs(data.data || [])
    const { data: _, ...filterData } = data
    patchJobsMeta(filterData)
    return data
  }

  async function fetchJobDetail(jobId: string): Promise<JobTaskDetail | null> {
    const { data } = await apiClient.jobs.jobsDetailDetail(jobId)

    patchJobDetail(data || null)
    return data || null
  }

  function $reset() {
    jobs.value = []
    metaJobs.value = null
  }

  return {
    jobs,
    metaJobs,
    jobDetail,

    patchJobs,
    patchJobsMeta,
    fetchJobs,
    patchJobDetail,
    fetchJobDetail,
    $reset,
  }
})
