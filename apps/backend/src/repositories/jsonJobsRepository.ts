import fs from 'fs/promises';

import JSON5 from 'json5';

import { localBDfile } from '@/config';
import { JobsNotFoundError, UrlNotFoundError } from '@/entities/jobs/jobsErrors';
import { BDNotFoundError } from '@/services/errorService';

import type { JobsRepository } from '@/entities/jobs/jobsRepository';
import { JobTask } from '@/entities/jobs/jobTask';
import { TaskUrl } from '@/entities/jobs/taskUrl';

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

/** Репозиторий: чтение и запись процессов в виде `<имя>.json` в каталоге данных. */
export class JsonJobsRepository implements JobsRepository {
  public async get(): Promise<JobTask[]> {
    const bdData = await readBdHelper();
    const jobs = bdData.jobs.map((item) => {
      return new JobTask(item);
    });
    return jobs;
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

    const jsonBd = `${JSON.stringify(bdData, null, '\t')}\n`;
    await fs.writeFile(localBDfile(), jsonBd, 'utf-8');
    return newJob;
  }

  public async removeJob(id: string): Promise<void> {
    const jobById = await this.getOne(id);
    const bdData = await readBdHelper();
    const newJobs = bdData.taskUrls.filter((item) => item.jobId !== jobById.id);
    const newUrls = bdData.jobs.filter((item) => item.id !== jobById.id);

    const jsonBd = `${JSON.stringify(
      {
        jobs: newJobs,
        taskUrls: newUrls,
      },
      null,
      '\t',
    )}\n`;

    await fs.writeFile(localBDfile(), jsonBd, 'utf-8');
  }

  public async getJobUrls(jobId: string): Promise<TaskUrl[]> {
    const jobData = await this.getOne(jobId);
    const taskUrls = jobData.urlIds;

    const bdData = await readBdHelper();
    const taskUrlsData = taskUrls.map((url) => {
      const findUrlData = bdData.taskUrls.find((item) => item.id === url) || null;
      if (!findUrlData) return null;

      return new TaskUrl(findUrlData);
    });

    return taskUrlsData.filter(Boolean) as TaskUrl[];
  }

  public async getUrlById(urlId: string): Promise<TaskUrl> {
    const { taskUrls } = await readBdHelper();
    const findUrl = taskUrls.find((url) => url.id === urlId) || null;
    if (!findUrl) {
      throw new UrlNotFoundError(urlId);
    }
    return new TaskUrl(findUrl);
  }
}
