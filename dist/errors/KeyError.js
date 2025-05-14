"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyError = void 0;
class KeyError extends Error {
    constructor(error) {
        super('The key has not been configured.');
        this.name = 'KeyError';
    }
}
exports.KeyError = KeyError;
