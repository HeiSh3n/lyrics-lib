"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
class NotFoundError extends Error {
    constructor() {
        super('Track was not found');
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
