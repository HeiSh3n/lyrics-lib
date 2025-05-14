"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.logger = {
    info: (...args) => {
        console.info('[lyrics-lib][INFO]', ...args);
    },
    warn: (...args) => {
        console.warn('[lyrics-lib][WARN]', ...args);
    },
    error: (...args) => {
        console.error('[lyrics-lib][ERROR]', ...args);
    },
};
