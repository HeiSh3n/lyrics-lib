"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchWithHeaders = fetchWithHeaders;
const constants_1 = require("../config/constants");
function fetchWithHeaders(url) {
    return fetch(url, {
        headers: {
            'Lrclib-Client': constants_1.LRCLIB_CLIENT_HEADER,
            'User-Agent': constants_1.LRCLIB_CLIENT_HEADER,
        },
    });
}
