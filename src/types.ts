export interface BookmarkType {
    [key: string]: string
}

export class Error {
    public message: string;

    constructor(message: string) {
        this.message = message
    }
}

export class JSONLoadError extends Error {
    public path: string;

    constructor(message: string, path: string) {
        super(message);
        this.path = path;
    }
}