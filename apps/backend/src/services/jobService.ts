import type { JobTask } from '@/entities/jobs/jobTask';
import type { CreateJobDTOReturn, CreateJobInput, JobsService } from '@/entities/jobs/jobService';
import { JsonJobsRepository } from '@/repositories/jsonJobsRepository';
import { TaskUrl } from '@/entities/jobs/taskUrl';

export class JobService implements JobsService {
  private jobRepository;

  constructor() {
    this.jobRepository = new JsonJobsRepository();
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
    return {
      [task.id]: task,
    };
  }

  public async getUrlsJob(jobId: string): Promise<TaskUrl[]> {
    return await this.jobRepository.getJobUrls(jobId);
  }

  public async getUrl(urlId: string): Promise<TaskUrl> {
    return await this.jobRepository.getUrlById(urlId);
  }
}
