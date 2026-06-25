import type { JobTask } from './jobTask';
import type { TaskUrl } from './taskUrl';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Доступ к сохранённому процессу (jobs): получение и запись. */
export interface JobsRepository {
  get(page?: number, limit?: number): Promise<PaginatedResult<JobTask>>;
  getOne(id: string): Promise<JobTask>;
  save(urls: string[]): Promise<JobTask>;
  removeJob(id: string): Promise<void>;
  getJobUrls(jobId: string): Promise<TaskUrl[]>;
  getUrlById(urlId: string): Promise<TaskUrl>;
  updateTaskUrl(taskUrlId: string, data: Partial<TaskUrl>): Promise<void>;
  updateJob(jobId: string, data: Partial<JobTask>): Promise<JobTask>;
}
