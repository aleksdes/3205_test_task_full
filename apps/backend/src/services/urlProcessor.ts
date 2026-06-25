import type { JobsRepository } from '@/entities/jobs/jobsRepository';
import type { TaskUrl } from '@/entities/jobs/taskUrl';

const BATCH_SIZE = 5;
const REQUEST_TIMEOUT_MS = 10000;

function randomDelay(): Promise<void> {
  const ms = Math.floor(Math.random() * 10001);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatFetchError(err: unknown): string {
  const error = err as Error & { cause?: Error & { code?: string } };
  if (error.cause?.code === 'UND_ERR_CONNECT_TIMEOUT') {
    return `Connection timeout (${REQUEST_TIMEOUT_MS}ms): ${error.cause.message}`;
  }
  return error.message || String(err);
}

async function headRequest(url: string): Promise<{ httpStatus: number; errorMessage?: string }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { method: 'HEAD', signal: controller.signal });
    return { httpStatus: response.status };
  } catch (err) {
    return { httpStatus: 0, errorMessage: formatFetchError(err) };
  } finally {
    clearTimeout(timeoutId);
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
    const results = await Promise.allSettled(promises);

    for (const result of results) {
      if (result.status === 'rejected') {
        console.error('[UrlProcessor] batch item failed:', result.reason);
      }
    }
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
        startTimeJob: startTime,
        status: 'error',
        errorMessage,
        endTimeJob: endTime,
      });
    } else {
      await this.repository.updateTaskUrl(taskUrl.id, {
        startTimeJob: startTime,
        status: 'success',
        httpStatus,
        endTimeJob: endTime,
      });
    }
  }
}
