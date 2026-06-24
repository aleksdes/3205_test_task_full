import { nanoid } from 'nanoid';

export type TaskUrlStatus = 'pending' | 'in_progress' | 'success' | 'error' | 'cancelled';

export interface ICreateDTOUrl {
  url: string;
  jobId: string;
  id?: string;
  status?: TaskUrlStatus | null;
}

export class TaskUrl {
  public readonly id: string;
  public readonly jobId: string;
  public readonly url: string;
  public status?: TaskUrlStatus | null;
  public httpStatus?: number;
  public errorMessage?: string;
  public startTimeJob?: Date;
  public endTimeJob?: Date;

  public constructor(dataUrl: ICreateDTOUrl) {
    this.id = dataUrl.id || nanoid();
    this.url = dataUrl.url;
    this.jobId = dataUrl.jobId;
    this.status = dataUrl.status || null;
  }

  public markInProgress(): void {
    this.status = 'in_progress';
  }

  public markSuccess(httpStatus?: number): void {
    this.status = 'success';
    this.httpStatus = httpStatus;
    this.endTimeJob = new Date();
  }

  public markError(errorMessage: string, httpStatus?: number): void {
    this.status = 'error';
    this.httpStatus = httpStatus;
    this.errorMessage = errorMessage;
    this.endTimeJob = new Date();
  }

  public markCancelled(): void {
    this.status = 'cancelled';
    this.endTimeJob = new Date();
  }
}
