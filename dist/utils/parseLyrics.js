"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseLyrics = parseLyrics;
/**
 * Parses a lyrics string into synced and unsynced lines.
 * - Synced lines have [mm:ss.xx] timestamps.
 * - Unsynced lines are plain text.
 */
function parseLyrics(raw) {
    const lines = raw
        .replace(/\[[a-zA-Z]+:.*?\]/g, '') // Remove metadata tags like [artist:Name]
        .trim()
        .split('\n');
    const timestampRegex = /\[([0-9]{2}):([0-9]{2}(?:\.[0-9]{1,2})?)\]/;
    const synced = [];
    const unsynced = [];
    for (const line of lines) {
        const match = line.match(timestampRegex);
        if (match) {
            const minutes = Number(match[1]);
            const seconds = Number(match[2]);
            const startTime = Math.round((minutes * 60 + seconds) * 1000); // ms
            const text = line.replace(timestampRegex, '').trim();
            if (text)
                synced.push({ text, startTime });
        }
        else {
            const text = line.trim();
            if (text)
                unsynced.push({ text });
        }
    }
    return {
        synced: synced.length > 0 ? synced : null,
        unsynced,
    };
}
