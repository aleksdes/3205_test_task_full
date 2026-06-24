import type { Store } from 'pinia';
import type { JobTask } from '@/shared/generated/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApiClient } from '@/shared/lib/api-client';

export interface IJobsState {}

export interface IJobsGetters {}

export interface IJobsActions {
  patchJobs: (data: JobTask[]) => void;
  fetchJobs: (filter: GetWorkflowParams) => Promise<JobTask[]>;
  $reset: () => void;
}

export interface IJobsStore extends Store<'jobs', IJobsState, IJobsGetters, IJobsActions> {}

export const useJobs: () => IJobsStore = defineStore('jobs', () => {
  const apiClient = useApiClient();

  const jobs = ref<Workflow | null>(null);

  function patchJobs(data: Workflow | null) {
    jobs.value = data;
  }

  async function fetchJobs(filter: GetWorkflowParams): Promise<Workflow | null> {
    if (!filter.wfName) throw new Error('Не выбран рабочий процесс');

    const { data } = await apiClient.workflow.getWorkflow({
      wfName: filter.wfName,
    });

    patchJobs(data);
    return data;
  }

  function $reset() {
    jobs.value = [];
  }

  return {
    jobs,
    patchJobs,
    fetchJobs,
    $reset,
  };
});
