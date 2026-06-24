import type { JobTask, JobTaskStatus, JobTaskStats } from './jobTask';
import type { TaskUrl, TaskUrlStatus } from './taskUrl';

export interface CreateJobInput {
  urls: string[];
}

export type CreateJobDTOReturn = {
  jobId: string;
};

export interface JobsService {
  getJobs(): Promise<JobTask[]>;
  getJobById(jobId: string): Promise<JobTask>;
  deleteJob(jobId: string): Promise<void>;
  createJob(input: CreateJobInput): Promise<CreateJobDTOReturn>;
  getUrlsJob(jobId: string): Promise<TaskUrl[]>;
  getUrl(urlId: string): Promise<TaskUrl>;
  updateTaskUrl(
    taskUrlId: string,
    data: {
      status?: TaskUrlStatus | null;
      httpStatus?: number;
      errorMessage?: string;
      startTimeJob?: Date;
      endTimeJob?: Date;
    },
  ): Promise<void>;
  updateJob(
    jobId: string,
    data: {
      status?: JobTaskStatus | null;
      stats?: JobTaskStats | null;
    },
  ): Promise<void>;
}
