export class WhitePixelNotFoundException extends Error {
    constructor() {
        super(`No white pixel found in bitmap`);
    }
}
