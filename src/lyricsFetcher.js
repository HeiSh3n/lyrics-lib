"use strict";
// lyricsFetcher.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchLyrics = fetchLyrics;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
function cleanLyrics(raw) {
    let lines = raw
        .replace(/\s{3,}/g, ' ') // Collapse long whitespace
        .replace(/\n{2,}/g, '\n') // Collapse multiple newlines
        .replace(/<img[^>]*>/gi, '') // Remove images if any HTML remains
        .split('\n');
    // Remove only non-lyric lines at the very top (contributors, translations, etc.)
    while (lines.length &&
        (/contributors?/i.test(lines[0]) || /translations?/i.test(lines[0]) || /^\d+\s*contributors?/i.test(lines[0]) || /^translations?/i.test(lines[0]) || !/[a-z\[]/.test(lines[0]))) {
        lines.shift();
    }
    // Remove lines that are just numbers or empty
    lines = lines.filter(line => line.trim() && !/^\d+$/.test(line.trim()));
    // Remove bracketed non-lyric content only if the line is just a bracketed tag
    lines = lines.map(line => (/^\[.*?\]$/.test(line.trim()) ? '' : line)).filter(Boolean);
    return lines
        .join('\n')
        .replace(/Read More.*/gi, '')
        .trim();
}
function fetchLyrics(title, artist, lang, apiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const key = apiKey;
        const query = `${title} ${artist || ''}`.trim();
        console.log('[DEBUG] Query:', query);
        console.log('[DEBUG] API Key provided:', !!key);
        if (!title) {
            console.log('[DEBUG] No title provided.');
            return null;
        }
        if (key) {
            // Use Genius API for search
            const searchUrl = `https://api.genius.com/search?q=${encodeURIComponent(query)}`;
            try {
                console.log('[DEBUG] Genius API search URL:', searchUrl);
                const searchRes = yield axios_1.default.get(searchUrl, {
                    headers: { Authorization: `Bearer ${key}` },
                });
                if (!searchRes.data || !searchRes.data.response || !Array.isArray(searchRes.data.response.hits)) {
                    console.log('[DEBUG] Malformed Genius API response.');
                    return null;
                }
                const hits = searchRes.data.response.hits;
                if (!hits || hits.length === 0) {
                    console.log('[DEBUG] No hits found from Genius API.');
                    return null;
                }
                const songPath = hits[0].result.path;
                const songUrl = `https://genius.com${songPath}`;
                console.log('[DEBUG] Genius song URL:', songUrl);
                // Scrape lyrics from the song page
                const pageRes = yield axios_1.default.get(songUrl);
                const $ = cheerio.load(pageRes.data);
                let lyrics = $('[data-lyrics-container=true]').text();
                if (!lyrics) {
                    console.log('[DEBUG] No lyrics found on Genius song page.');
                    return null;
                }
                lyrics = cleanLyrics(lyrics);
                if (!lyrics) {
                    console.log('[DEBUG] Lyrics cleaned to empty string.');
                    return null;
                }
                return {
                    lyrics,
                    source: 'genius',
                    language: lang || 'en',
                };
            }
            catch (err) {
                console.log('[DEBUG] Error using Genius API, falling back to scraping:', err);
                // Fallback to scraping below
            }
        }
        // Scrape Genius search results page if no API key or API fails
        try {
            const searchUrl = `https://genius.com/search?q=${encodeURIComponent(query)}`;
            console.log('[DEBUG] Scraping Genius search URL:', searchUrl);
            const searchRes = yield axios_1.default.get(searchUrl);
            const $ = cheerio.load(searchRes.data);
            const firstSongLink = $('a[href^="/lyrics/"]').first().attr('href') || $('a.mini_card').first().attr('href');
            if (!firstSongLink) {
                console.log('[DEBUG] No song link found on Genius search page.');
                return null;
            }
            const songUrl = firstSongLink.startsWith('http') ? firstSongLink : `https://genius.com${firstSongLink}`;
            console.log('[DEBUG] Scraping Genius song URL:', songUrl);
            const pageRes = yield axios_1.default.get(songUrl);
            const $$ = cheerio.load(pageRes.data);
            let lyrics = $$('[data-lyrics-container=true]').text();
            if (!lyrics) {
                console.log('[DEBUG] No lyrics found on scraped Genius song page.');
                return null;
            }
            lyrics = cleanLyrics(lyrics);
            if (!lyrics) {
                console.log('[DEBUG] Lyrics cleaned to empty string.');
                return null;
            }
            return {
                lyrics,
                source: 'genius-scrape',
                language: lang || 'en',
            };
        }
        catch (err) {
            console.log('[DEBUG] Error scraping Genius:', err);
            return null;
        }
    });
}
