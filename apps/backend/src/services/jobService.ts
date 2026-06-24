import type { JobTask } from '@/entities/jobs/jobTask';
import type { CreateJobDTOReturn, CreateJobInput, JobsService } from '@/entities/jobs/jobService';
import { JsonJobsRepository } from '@/repositories/jsonJobsRepository';
import type { TaskUrl, TaskUrlStatus } from '@/entities/jobs/taskUrl';
import type { JobTaskStatus, JobTaskStats } from '@/entities/jobs/jobTask';
import { UrlProcessor } from './urlProcessor';

export class JobService implements JobsService {
  private jobRepository;
  private urlProcessor;

  constructor() {
    this.jobRepository = new JsonJobsRepository();
    this.urlProcessor = new UrlProcessor(this.jobRepository);
  }

  public async getJobs(): Promise<JobTask[]> {
    return await this.jobRepository.get();
  }

  public async getJobById(jobId: string): Promise<JobTask> {
    return await this.jobRepository.getOne(jobId);
  }

  public async deleteJob(jobId: string): Promise<void> {
    return await this.jobRepository.removeJob(jobId);
  }

  public async createJob(input: CreateJobInput): Promise<CreateJobDTOReturn> {
    const task = await this.jobRepository.save(input.urls);

    this.urlProcessor.processJob(task.id);

    return { jobId: task.id };
  }

  public async getUrlsJob(jobId: string): Promise<TaskUrl[]> {
    return await this.jobRepository.getJobUrls(jobId);
  }

  public async getUrl(urlId: string): Promise<TaskUrl> {
    return await this.jobRepository.getUrlById(urlId);
  }

  public async updateTaskUrl(
    taskUrlId: string,
    data: {
      status?: TaskUrlStatus | null;
      httpStatus?: number;
      errorMessage?: string;
      startTimeJob?: Date;
      endTimeJob?: Date;
    },
  ): Promise<void> {
    return await this.jobRepository.updateTaskUrl(taskUrlId, data);
  }

  public async updateJob(
    jobId: string,
    data: {
      status?: JobTaskStatus | null;
      stats?: JobTaskStats | null;
    },
  ): Promise<void> {
    return await this.jobRepository.updateJob(jobId, data);
  }
}
