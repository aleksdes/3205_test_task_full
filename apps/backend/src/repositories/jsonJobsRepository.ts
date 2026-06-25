import fs from 'fs/promises';

import JSON5 from 'json5';

import { localBDfile } from '@/config';
import { JobsNotFoundError, UrlNotFoundError } from '@/entities/jobs/jobsErrors';
import { BDNotFoundError } from '@/services/errorService';

import type { JobsRepository, PaginatedResult } from '@/entities/jobs/jobsRepository';
import { JobTask, type JobTaskStatus, type JobTaskStats } from '@/entities/jobs/jobTask';
import { TaskUrl, type TaskUrlStatus } from '@/entities/jobs/taskUrl';

/** Описание данных JSON-файле */
type BdJsonType = {
  jobs: JobTask[];
  taskUrls: TaskUrl[];
};

async function readBdHelper(): Promise<BdJsonType> {
  let raw: string;
  try {
    raw = await fs.readFile(localBDfile(), 'utf-8');
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new BDNotFoundError();
    }
    throw err;
  }

  const data = JSON5.parse(raw) as BdJsonType;
  return data;
}

async function writeBdHelper(data: BdJsonType): Promise<void> {
  const json = `${JSON.stringify(data, null, '\t')}\n`;
  await fs.writeFile(localBDfile(), json, 'utf-8');
}

/** Репозиторий: чтение и запись процессов в виде `<имя>.json` в каталоге данных. */
export class JsonJobsRepository implements JobsRepository {
  public async get(page = 1, limit = 10): Promise<PaginatedResult<JobTask>> {
    const bdData = await readBdHelper();
    const sorted = bdData.jobs.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const total = sorted.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const items = sorted.slice(start, start + limit).map((item) => new JobTask(item));

    return { data: items, total, page, limit, totalPages };
  }

  public async getOne(id: string): Promise<JobTask> {
    const { jobs } = await readBdHelper();
    const findJob = jobs.find((job) => job.id === id) || null;
    if (!findJob) {
      throw new JobsNotFoundError(id);
    }
    return new JobTask(findJob);
  }

  public async save(urls: string[]): Promise<JobTask> {
    const newJob = new JobTask();
    newJob.markStatus('pending');

    const newUrls: TaskUrl[] = urls.map(
      (item: string) =>
        new TaskUrl({
          url: item,
          jobId: newJob.id,
          status: null,
        }),
    );

    const bdData = await readBdHelper();
    bdData.taskUrls.push(...newUrls);
    newJob.updateUrlIds(newUrls.map((item) => item.id));
    bdData.jobs.push(newJob);

    await writeBdHelper(bdData);
    return newJob;
  }

  public async removeJob(id: string): Promise<void> {
    const bdData = await readBdHelper();
    const exists = bdData.jobs.some((item) => item.id === id);
    if (!exists) {
      throw new JobsNotFoundError(id);
    }

    const newJobs = bdData.jobs.filter((item) => item.id !== id);
    const newUrls = bdData.taskUrls.filter((item) => item.jobId !== id);

    await writeBdHelper({ jobs: newJobs, taskUrls: newUrls });
  }

  public async getJobUrls(jobId: string): Promise<TaskUrl[]> {
    const bdData = await readBdHelper();
    const taskUrls = bdData.taskUrls.filter((item) => item.jobId === jobId);

    return taskUrls.map((item) => new TaskUrl(item));
  }

  public async getUrlById(urlId: string): Promise<TaskUrl> {
    const { taskUrls } = await readBdHelper();
    const findUrl = taskUrls.find((url) => url.id === urlId) || null;
    if (!findUrl) {
      throw new UrlNotFoundError(urlId);
    }
    return new TaskUrl(findUrl);
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
    const bdData = await readBdHelper();
    const idx = bdData.taskUrls.findIndex((item) => item.id === taskUrlId);

    if (idx === -1) {
      throw new UrlNotFoundError(taskUrlId);
    }

    const target = bdData.taskUrls[idx];

    if (data.status !== undefined) target.status = data.status;
    if (data.httpStatus !== undefined) target.httpStatus = data.httpStatus;
    if (data.errorMessage !== undefined) target.errorMessage = data.errorMessage;
    if (data.startTimeJob !== undefined) target.startTimeJob = data.startTimeJob;
    if (data.endTimeJob !== undefined) target.endTimeJob = data.endTimeJob;

    await writeBdHelper(bdData);
  }

  public async updateJob(
    jobId: string,
    data: {
      status?: JobTaskStatus | null;
      stats?: JobTaskStats | null;
    },
  ): Promise<JobTask> {
    const bdData = await readBdHelper();
    const idx = bdData.jobs.findIndex((item) => item.id === jobId);

    if (idx === -1) {
      throw new JobsNotFoundError(jobId);
    }

    const target = bdData.jobs[idx];

    if (data.status !== undefined) target.status = data.status;
    if (data.stats !== undefined) target.stats = data.stats;

    await writeBdHelper(bdData);
    return target;
  }
}
