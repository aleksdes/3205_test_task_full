import type { JobTask, JobTaskStatus, JobTaskStats } from './jobTask';
import type { TaskUrl, TaskUrlStatus } from './taskUrl';

/** Доступ к сохранённому процессу (jobs): получение и запись. */
export interface JobsRepository {
  get(): Promise<JobTask[]>;
  getOne(id: string): Promise<JobTask>;
  save(urls: string[]): Promise<JobTask>;
  removeJob(id: string): Promise<void>;
  getJobUrls(jobId: string): Promise<TaskUrl[]>;
  getUrlById(urlId: string): Promise<TaskUrl>;
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
