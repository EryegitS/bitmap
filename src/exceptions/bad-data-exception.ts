export class BadDataException extends Error {
  private payload: string;

  constructor(payload: string) {
    super(`Input data is incorrect. Please check: ${payload}`);
    this.payload = payload;
  }
}
