import type { JobTask } from '@/entities/jobs/jobTask';
import type {
  CreateJobDTOReturn,
  CreateJobInput,
  JobsService,
  JobTaskDetail,
} from '@/entities/jobs/jobService';
import { JsonJobsRepository } from '@/repositories/jsonJobsRepository';
import type { TaskUrl } from '@/entities/jobs/taskUrl';
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

  public async getJobByIdDetail(jobId: string): Promise<JobTaskDetail> {
    const job = await this.jobRepository.getOne(jobId);
    const jobUrls = await this.jobRepository.getJobUrls(jobId);

    return {
      id: job.id,
      createdAt: job.createdAt,
      status: job.status,
      stats: job.stats,
      urls: jobUrls,
    } as JobTaskDetail;
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

  public async updateTaskUrl(taskUrlId: string, data: Partial<TaskUrl>): Promise<void> {
    return await this.jobRepository.updateTaskUrl(taskUrlId, data);
  }

  public async updateJob(jobId: string, data: Partial<JobTask>): Promise<void> {
    return await this.jobRepository.updateJob(jobId, data);
  }
}
