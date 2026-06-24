/** Job c jobId в bd отсутствует. */
export class JobsNotFoundError extends Error {
  public constructor(public readonly jobId: string) {
    super(`Job ${jobId} was not found`);
    this.name = 'JobNotFoundError';
  }
}

/** В bd нет url с заданным id для jobId */
export class TaskUrlsNotFoundError extends Error {
  public constructor(
    public readonly jobId: string,
    public readonly urlId: string,
  ) {
    super(`URL with id ${urlId} not found in job ${jobId}`);
    this.name = 'TaskUrlNotFoundError';
  }
}

/** В bd нет url с заданным id */
export class UrlNotFoundError extends Error {
  public constructor(public readonly urlId: string) {
    super(`URL with id ${urlId} not found`);
    this.name = 'UrlNotFoundError';
  }
}
