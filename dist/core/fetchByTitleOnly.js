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
exports.fetchByTitleOnly = fetchByTitleOnly;
const fetchWithHeaders_1 = require("./fetchWithHeaders");
const constants_1 = require("../config/constants");
function fetchByTitleOnly(title) {
    return __awaiter(this, void 0, void 0, function* () {
        const searchParams = new URLSearchParams({ track_name: title });
        const searchUrl = `${constants_1.LRCLIB_API}/search?${searchParams.toString()}`;
        const searchRes = yield (0, fetchWithHeaders_1.fetchWithHeaders)(searchUrl);
        if (searchRes.ok) {
            const searchData = yield searchRes.json();
            if (Array.isArray(searchData) && searchData.length > 0 && searchData[0].id) {
                const getUrl = `${constants_1.LRCLIB_API}/get/${searchData[0].id}`;
                const getRes = yield (0, fetchWithHeaders_1.fetchWithHeaders)(getUrl);
                if (getRes.ok) {
                    const getData = yield getRes.json();
                    if (getData && (getData.plainLyrics || getData.syncedLyrics)) {
                        return getData.plainLyrics || getData.syncedLyrics || null;
                    }
                }
            }
        }
        return null;
    });
}
