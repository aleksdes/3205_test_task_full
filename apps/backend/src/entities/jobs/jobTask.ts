import { nanoid } from 'nanoid';

export type JobTaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'failed';

export type JobTaskStats = 'success' | 'error';

export interface ICreateDTOJob {
  id?: string;
  createdAt?: Date;
  status?: JobTaskStatus | null;
  stats?: JobTaskStats | null;
  urlIds?: string[];
}

export class JobTask {
  public readonly id: string;
  public readonly createdAt: Date;
  public status: JobTaskStatus | null;
  public stats: JobTaskStats | null;
  public urlIds: string[];

  public constructor(dataJob: ICreateDTOJob = {}) {
    this.id = dataJob.id || nanoid();
    this.createdAt = dataJob.createdAt || new Date();
    this.status = dataJob.status || null;
    this.urlIds = dataJob.urlIds || [];
    this.stats = dataJob.stats || null;
  }

  public markStatus(status: JobTaskStatus | null): void {
    this.status = status;
  }

  public markStats(stats: JobTaskStats | null): void {
    this.stats = stats;
  }

  public updateUrlIds(urls: string[]): void {
    this.urlIds = urls;
  }
}
