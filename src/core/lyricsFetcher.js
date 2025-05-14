"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLyrics = getLyrics;
/**
 * Fetch lyrics from lrclib API by title and optional artist.
 * Returns the lyrics as a string, or null if not found.
 */
function getLyrics(_a) {
    return __awaiter(this, arguments, void 0, function* ({ title, artist }) {
        if (!title)
            throw new Error('Title is required');
        const params = new URLSearchParams({ track_name: title });
        if (artist)
            params.append('artist_name', artist);
        const url = `https://api.lrclib.net/api/get?${params.toString()}`;
        const res = yield fetch(url);
        if (!res.ok)
            return null;
        const data = yield res.json();
        if (data && data.lyrics)
            return data.lyrics;
        return null;
    });
}
