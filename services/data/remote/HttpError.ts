export class HttpError extends Error {
    constructor(readonly status: number) {
        super(`HTTP error with status ${status}`);
    }
}
