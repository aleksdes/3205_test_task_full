import type { JobTask } from './jobTask';
import { TaskUrl } from './taskUrl';

export interface CreateJobInput {
  urls: string[];
}

export type CreateJobDTOReturn = {
  [key: string]: JobTask;
};

export interface JobsService {
  getJobs(): Promise<JobTask[]>;
  getJobById(jobId: string): Promise<JobTask>;
  deleteJob(jobId: string): Promise<void>;
  createJob(input: CreateJobInput): Promise<CreateJobDTOReturn>;
  getUrlsJob(jobId: string): Promise<TaskUrl[]>;
  getUrl(urlId: string): Promise<TaskUrl>;
}
