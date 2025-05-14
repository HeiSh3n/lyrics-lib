"use strict";
// Main entry point for lyrics-lib
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
exports.GeniusClient = void 0;
exports.getLyrics = getLyrics;
const lyricsFetcher_1 = require("./lyricsFetcher");
class GeniusClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    getLyrics(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, lyricsFetcher_1.fetchLyrics)(options.title, options.artist, options.lang, this.apiKey);
        });
    }
}
exports.GeniusClient = GeniusClient;
/**
 * @deprecated Use GeniusClient instead.
 */
function getLyrics(options) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, lyricsFetcher_1.fetchLyrics)(options.title, options.artist, options.lang);
    });
}
