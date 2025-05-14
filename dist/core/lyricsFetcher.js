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
const fetchByTrackAndArtist_1 = require("./fetchByTrackAndArtist");
const fetchByTitleOnly_1 = require("./fetchByTitleOnly");
function getLyrics(_a) {
    return __awaiter(this, arguments, void 0, function* ({ title, artist }) {
        if (!title)
            throw new Error('Title is required');
        if (artist) {
            const result = yield (0, fetchByTrackAndArtist_1.fetchByTrackAndArtist)(title, artist);
            if (result)
                return result;
        }
        return yield (0, fetchByTitleOnly_1.fetchByTitleOnly)(title);
    });
}
