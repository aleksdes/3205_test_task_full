import type { JobTask } from './jobTask';
import { TaskUrl } from './taskUrl';

/** Доступ к сохранённому процессу (jobs): получение и запись. */
export interface JobsRepository {
  get(): Promise<JobTask[]>;
  getOne(id: string): Promise<JobTask>;
  save(urls: string[]): Promise<JobTask>;
  removeJob(id: string): Promise<void>;
  getJobUrls(jobId: string): Promise<TaskUrl[]>;
  getUrlById(urlId: string): Promise<TaskUrl>;
}
