"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestError = void 0;
class RequestError extends Error {
    constructor(error) {
        super('Request error' + (error ? ' ' + error : ''));
        this.name = 'RequestError';
    }
}
exports.RequestError = RequestError;
