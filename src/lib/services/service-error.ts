export class ServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}
