import type { JobsRepository } from '@/entities/jobs/jobsRepository';
import type { TaskUrl } from '@/entities/jobs/taskUrl';

const BATCH_SIZE = 5;
const REQUEST_TIMEOUT_MS = 10000;

function randomDelay(signal?: AbortSignal): Promise<void> {
  const ms = Math.floor(Math.random() * 10001);
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }
    const timer = setTimeout(resolve, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

function formatFetchError(err: unknown): string {
  const error = err as Error & { cause?: Error & { code?: string } };
  if (error.cause?.code === 'UND_ERR_CONNECT_TIMEOUT') {
    return `Connection timeout (${REQUEST_TIMEOUT_MS}ms): ${error.cause.message}`;
  }
  return error.message || String(err);
}

async function headRequest(url: string, signal?: AbortSignal): Promise<{ httpStatus: number; errorMessage?: string }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  const combinedSignal = signal
    ? combineAbortSignals(signal, controller.signal)
    : controller.signal;

  try {
    const response = await fetch(url, { method: 'HEAD', signal: combinedSignal });
    return { httpStatus: response.status };
  } catch (err) {
    return { httpStatus: 0, errorMessage: formatFetchError(err) };
  } finally {
    clearTimeout(timeoutId);
  }
}

function combineAbortSignals(...signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();
  for (const sig of signals) {
    if (sig.aborted) {
      controller.abort(sig.reason);
      return controller.signal;
    }
    sig.addEventListener('abort', () => controller.abort(sig.reason), { once: true });
  }
  return controller.signal;
}

export class UrlProcessor {
  private repository: JobsRepository;
  private runningJobs = new Map<string, AbortController>();

  public constructor(repository: JobsRepository) {
    this.repository = repository;
  }

  public cancelJob(jobId: string): void {
    const controller = this.runningJobs.get(jobId);
    if (controller) {
      controller.abort(new DOMException('Job cancelled', 'AbortError'));
      this.runningJobs.delete(jobId);
    }
  }

  public async processJob(jobId: string): Promise<void> {
    if (this.runningJobs.has(jobId)) {
      return;
    }

    const abortController = new AbortController();
    this.runningJobs.set(jobId, abortController);

    try {
      await this.repository.updateJob(jobId, { status: 'in_progress' });

      const urls = await this.repository.getJobUrls(jobId);

      for (let i = 0; i < urls.length; i += BATCH_SIZE) {
        if (abortController.signal.aborted) break;
        const batch = urls.slice(i, i + BATCH_SIZE);
        await this.processBatch(batch, abortController.signal);
      }

      if (abortController.signal.aborted) {
        await this.repository.updateJob(jobId, { status: 'cancelled' });
        return;
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
      try {
        if ((err as Error)?.name === 'AbortError') {
          await this.repository.updateJob(jobId, { status: 'cancelled' });
        } else {
          console.error(`[UrlProcessor] job ${jobId} failed:`, err);
          await this.repository.updateJob(jobId, { status: 'failed' });
        }
      } catch {
        // job may have been deleted during processing
      }
    } finally {
      this.runningJobs.delete(jobId);
    }
  }

  private async processBatch(batch: TaskUrl[], signal: AbortSignal): Promise<void> {
    const promises = batch.map((taskUrl) => this.processSingleUrl(taskUrl, signal));
    const results = await Promise.allSettled(promises);

    for (const result of results) {
      if (result.status === 'rejected' && (result.reason as Error)?.name !== 'AbortError') {
        console.error('[UrlProcessor] batch item failed:', result.reason);
      }
    }
  }

  private async processSingleUrl(taskUrl: TaskUrl, signal: AbortSignal): Promise<void> {
    const startTime = new Date();

    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');

    await this.repository.updateTaskUrl(taskUrl.id, {
      status: 'in_progress',
      startTimeJob: startTime,
    });

    await randomDelay(signal);

    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');

    const { httpStatus, errorMessage } = await headRequest(taskUrl.url, signal);

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
