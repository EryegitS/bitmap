export class ValidationException extends Error {
    constructor(payload: string) {
        super(`Bitmap data is not valid. Error: ${payload}`);
    }
}
