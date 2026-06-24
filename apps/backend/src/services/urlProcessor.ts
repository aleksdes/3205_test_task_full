import type { JobsRepository } from '@/entities/jobs/jobsRepository';
import type { TaskUrl } from '@/entities/jobs/taskUrl';

const BATCH_SIZE = 5;

function randomDelay(): Promise<void> {
  const ms = Math.floor(Math.random() * 10001);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function headRequest(url: string): Promise<{ httpStatus: number; errorMessage?: string }> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return { httpStatus: response.status };
  } catch (err) {
    return { httpStatus: 0, errorMessage: (err as Error).message };
  }
}

export class UrlProcessor {
  private repository: JobsRepository;

  public constructor(repository: JobsRepository) {
    this.repository = repository;
  }

  public async processJob(jobId: string): Promise<void> {
    try {
      await this.repository.updateJob(jobId, { status: 'in_progress' });

      const urls = await this.repository.getJobUrls(jobId);

      for (let i = 0; i < urls.length; i += BATCH_SIZE) {
        const batch = urls.slice(i, i + BATCH_SIZE);
        await this.processBatch(batch);
      }

      const updatedUrls = await this.repository.getJobUrls(jobId);
      const allSuccess = updatedUrls.every((u) => u.status === 'success');
      const anyError = updatedUrls.some((u) => u.status === 'error');

      if (allSuccess) {
        await this.repository.updateJob(jobId, {
          status: 'completed',
          stats: 'success',
        });
      } else if (anyError) {
        await this.repository.updateJob(jobId, {
          status: 'completed',
          stats: 'error',
        });
      } else {
        await this.repository.updateJob(jobId, { status: 'completed' });
      }
    } catch (err) {
      console.error(`[UrlProcessor] job ${jobId} failed:`, err);
      await this.repository.updateJob(jobId, { status: 'failed' });
    }
  }

  private async processBatch(batch: TaskUrl[]): Promise<void> {
    const promises = batch.map((taskUrl) => this.processSingleUrl(taskUrl));
    await Promise.all(promises);
  }

  private async processSingleUrl(taskUrl: TaskUrl): Promise<void> {
    const startTime = new Date();

    await this.repository.updateTaskUrl(taskUrl.id, {
      status: 'in_progress',
      startTimeJob: startTime,
    });

    await randomDelay();

    const { httpStatus, errorMessage } = await headRequest(taskUrl.url);

    const endTime = new Date();

    if (errorMessage) {
      await this.repository.updateTaskUrl(taskUrl.id, {
        status: 'error',
        errorMessage,
        endTimeJob: endTime,
      });
    } else {
      await this.repository.updateTaskUrl(taskUrl.id, {
        status: 'success',
        httpStatus,
        endTimeJob: endTime,
      });
    }
  }
}
