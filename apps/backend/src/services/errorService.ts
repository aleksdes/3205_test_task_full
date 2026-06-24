/** BD отсутствует. */
export class BDNotFoundError extends Error {
  public constructor(public readonly bdName = 'bd') {
    super(`BD with name - "${bdName}" - was not found`);
    this.name = 'BDNotFoundError';
  }
}
