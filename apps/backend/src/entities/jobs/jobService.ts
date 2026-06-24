import type { JobTask } from './jobTask';
import type { TaskUrl } from './taskUrl';

export interface CreateJobInput {
  urls: string[];
}

export type CreateJobDTOReturn = {
  jobId: string;
};

export type JobTaskDetail = Omit<JobTask, 'urlIds'> & { urls: TaskUrl[] };

export interface JobsService {
  getJobs(): Promise<JobTask[]>;
  getJobById(jobId: string): Promise<JobTask>;
  getJobByIdDetail(jobId: string): Promise<JobTaskDetail>;
  deleteJob(jobId: string): Promise<void>;
  createJob(input: CreateJobInput): Promise<CreateJobDTOReturn>;
  getUrlsJob(jobId: string): Promise<TaskUrl[]>;
  getUrl(urlId: string): Promise<TaskUrl>;
  updateTaskUrl(taskUrlId: string, data: Partial<TaskUrl>): Promise<void>;
  updateJob(jobId: string, data: Partial<JobTask>): Promise<void>;
}
