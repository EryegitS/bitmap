export class BadDataException extends Error {
  private payload: Record<any, any>;

  constructor(payload) {
    super(`Data is incorrect. Please check: ${payload}`);
    this.payload = payload;
  }
}
