export class InputFlagNotUsedException extends Error {
    constructor() {
        super(`--input flag must be used in command that run app!`);
    }
}
