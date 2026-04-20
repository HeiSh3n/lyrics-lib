"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geniusProvider = void 0;
exports.createGeniusProvider = createGeniusProvider;
const constants_js_1 = require("../config/constants.js");
const KeyError_js_1 = require("../errors/KeyError.js");
const RequestError_js_1 = require("../errors/RequestError.js");
function readEnvKey() {
    if (typeof process === 'undefined')
        return undefined;
    const key = process.env?.GENIUS_API_KEY;
    return key && key.trim() ? key.trim() : undefined;
}
function pickHit(hits, artist) {
    const songs = hits.filter((h) => h.type === 'song' && h.result?.url);
    if (songs.length === 0)
        return null;
    const first = songs[0] ?? null;
    if (!artist)
        return first;
    const needle = artist.trim().toLowerCase();
    const matched = songs.find((h) => (h.result.primary_artist?.name ?? '').toLowerCase().includes(needle));
    return matched ?? first;
}
/**
 * Remove HTML regions whose raw text is not intended for structural
 * parsing: comments (which may contain unbalanced `</div>`), `<script>`
 * bodies (which may embed `<div` tokens as JS strings), and `<style>`
 * bodies. Done BEFORE the div-depth scanner so the scanner only sees
 * real document structure and can't be tricked by non-structural
 * tokens into closing the lyrics container prematurely or inflating
 * depth.
 */
function stripHtmlNoise(html) {
    return html
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
}
/**
 * Decode the HTML entities that realistically appear in Genius lyric
 * pages. Numeric entities (`&#<dec>;` / `&#x<hex>;`) are decoded
 * generically so typographic characters like `&#8217;` (right single
 * quote) and `&#8230;` (ellipsis) come through correctly. Named
 * entities are covered by a curated table that matches the named
 * references Genius actually emits (smart quotes, em/en dashes,
 * ellipsis, apostrophes, basic XML entities).
 */
/**
 * Safely convert a parsed numeric entity value to a string. Returns
 * `null` when the value is out of the valid Unicode range
 * (`[0, 0x10FFFF]`), a lone surrogate half, or non-finite. The caller
 * uses this to preserve the original entity text on invalid input so
 * `String.fromCodePoint` never raises `RangeError` on malformed Genius
 * HTML.
 */
function toCodePoint(n) {
    if (!Number.isFinite(n) || n < 0 || n > 0x10ffff)
        return null;
    if (n >= 0xd800 && n <= 0xdfff)
        return null;
    return String.fromCodePoint(n);
}
function decodeEntities(s) {
    const named = {
        amp: '&',
        lt: '<',
        gt: '>',
        quot: '"',
        apos: "'",
        nbsp: ' ',
        rsquo: '\u2019',
        lsquo: '\u2018',
        ldquo: '\u201C',
        rdquo: '\u201D',
        mdash: '\u2014',
        ndash: '\u2013',
        hellip: '\u2026',
    };
    return s
        .replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
        const cp = toCodePoint(parseInt(hex, 16));
        return cp ?? match;
    })
        .replace(/&#(\d+);/g, (match, dec) => {
        const cp = toCodePoint(parseInt(dec, 10));
        return cp ?? match;
    })
        .replace(/&([a-zA-Z]+);/g, (match, name) => named[name] ?? match);
}
function extractLyrics(html) {
    const clean = stripHtmlNoise(html);
    const startRe = /<div[^>]*data-lyrics-container="true"[^>]*>/gi;
    // Regex tokenizer: matches <div…>, <div…/>, and </div> as distinct
    // tokens. `\b` after `div` rules out accidental matches on
    // `<divider>` or `<divs>`. Capture group 1 is `/` for self-closing
    // open tags, empty otherwise. `/g` + `lastIndex` lets us walk
    // forward from a known offset without re-scanning from 0.
    const tagRe = /<(\/)?div\b[^>]*?(\/)?>/gi;
    const chunks = [];
    let m;
    while ((m = startRe.exec(clean)) !== null) {
        const contentStart = m.index + m[0].length;
        tagRe.lastIndex = contentStart;
        let depth = 1;
        let contentEnd = contentStart;
        let tagMatch;
        while (depth > 0 && (tagMatch = tagRe.exec(clean)) !== null) {
            const isClose = tagMatch[1] === '/';
            const isSelfClose = tagMatch[2] === '/';
            if (isClose) {
                depth -= 1;
                if (depth === 0) {
                    contentEnd = tagMatch.index;
                    break;
                }
            }
            else if (!isSelfClose) {
                depth += 1;
            }
            // Self-closing open tag — depth unchanged, keep scanning.
        }
        if (depth !== 0)
            continue;
        chunks.push(clean.slice(contentStart, contentEnd));
    }
    if (chunks.length === 0)
        return null;
    const text = chunks
        .map((chunk) => decodeEntities(chunk
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/(?:p|div)>/gi, '\n')
        .replace(/<[^>]+>/g, '')))
        .join('\n')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    if (!text)
        return null;
    return stripGeniusMetadata(text);
}
/**
 * Known Genius section-label tokens. These are the tags Genius uses
 * inside `[...]` brackets to mark lyric structure. Restricting the
 * section-marker slice to this whitelist prevents false positives on
 * lyric lines that legitimately open with `[` — e.g. `[?]` for an
 * unclear lyric, or lowercase prose like `[hook intro]` that isn't a
 * structural tag.
 *
 * The regex below allows an optional numeric index (`[Verse 1]`) and
 * an optional `: annotation` suffix for featured artists
 * (`[Verse 2: Kendrick Lamar]`).
 */
const GENIUS_SECTION_LABELS = [
    'Intro',
    'Outro',
    'Verse',
    'Pre-?Chorus',
    'Post-?Chorus',
    'Chorus',
    'Bridge',
    'Refrain',
    'Hook',
    'Interlude',
    'Breakdown',
    'Break',
    'Build(?:-Up)?',
    'Drop',
    'Coda',
    'Skit',
    'Spoken',
    'Instrumental(?: Break)?',
    '(?:Guitar|Drum|Bass|Piano|Saxophone|Violin) Solo',
    'Solo',
    'Part',
];
const GENIUS_SECTION_RE = new RegExp(`^\\[(?:${GENIUS_SECTION_LABELS.join('|')})(?:\\s+\\d+)?(?:\\s*:\\s*[^\\]\\n]*)?\\]`, 'im');
/**
 * Strip Genius page metadata that sometimes leaks into the
 * `data-lyrics-container` block: contributor counts, translation nav,
 * the "... Lyrics" title repeat, and song description blurbs ending in
 * "Read More".
 *
 * Strategy (ordered from strictest to loosest):
 * 1. **Known section marker** — slice from the first line matching
 *    {@link GENIUS_SECTION_RE}. Genius uses these tags consistently
 *    (Intro, Verse, Chorus, Bridge, Outro, Pre-Chorus, Guitar Solo,
 *    etc.); the whitelist prevents mis-anchoring on `[?]` or
 *    `[hook intro]`.
 * 2. **"Read More" anchor** — when no known section marker exists but
 *    Genius's "… Read More" description blurb is present, slice
 *    everything after it. Stable landmark for lyric-start on songs
 *    without section tags.
 * 3. **Pass-through** — return unchanged when neither anchor is
 *    found. Safer to keep a few header lines than to eat real lyrics
 *    with a blind heuristic.
 */
function stripGeniusMetadata(text) {
    const sectionMatch = text.match(GENIUS_SECTION_RE);
    if (sectionMatch?.index !== undefined) {
        return sectionMatch.index === 0 ? text : text.slice(sectionMatch.index).trim();
    }
    const readMoreMatch = text.match(/Read More\s*(?:\r?\n|$)/);
    if (readMoreMatch?.index !== undefined) {
        const after = text
            .slice(readMoreMatch.index + readMoreMatch[0].length)
            .trim();
        if (after)
            return after;
    }
    return text;
}
/**
 * Strip the query string and fragment from `url` before it's exposed
 * on a {@link RequestError}. Use for API endpoints where the path
 * itself is a static route (e.g. `/search`) and only the query
 * string carries user input. Genius's search endpoint encodes the
 * caller's `title` + `artist` into `?q=`, and those terms are
 * already carried in structured form on `track` / `artist` —
 * keeping them out of the URL prevents double-logging of
 * user-supplied search terms.
 *
 * Falls back to the input unchanged if `url` is not parseable.
 */
function redactUrl(url) {
    try {
        const u = new URL(url);
        u.search = '';
        u.hash = '';
        return u.toString();
    }
    catch {
        return url;
    }
}
/**
 * Reduce `url` to origin only (scheme + host + optional port) before
 * it's exposed on a {@link RequestError}. Use for page URLs where
 * the path itself encodes user-supplied content (e.g. a Genius song
 * page's slug is derived from the title). Origin-only preserves
 * enough signal for ops diagnostics ("Genius page fetch failed")
 * without echoing the matched song's title back through logs.
 *
 * Falls back to the input unchanged if `url` is not parseable.
 */
function redactToOrigin(url) {
    try {
        return new URL(url).origin;
    }
    catch {
        return url;
    }
}
/**
 * Parse an HTTP `Retry-After` header value. Per RFC 7231 §7.1.3 the
 * value may be either a non-negative integer (delta-seconds) or an
 * `HTTP-date`. Returns the retry window in **seconds** relative to
 * now, or `undefined` when the header is absent or unparseable.
 *
 * Negative deltas (HTTP-date already in the past) are clamped to `0`
 * — the server still wants a retry, just without additional waiting.
 */
function parseRetryAfter(res) {
    const raw = res.headers.get('retry-after');
    if (!raw)
        return undefined;
    const trimmed = raw.trim();
    if (/^\d+$/.test(trimmed)) {
        const n = parseInt(trimmed, 10);
        return Number.isFinite(n) && n >= 0 ? n : undefined;
    }
    const when = Date.parse(trimmed);
    if (!Number.isFinite(when))
        return undefined;
    const delta = Math.round((when - Date.now()) / 1000);
    return delta > 0 ? delta : 0;
}
async function safeFetch(url, init, ctx) {
    try {
        return await fetch(url, init);
    }
    catch (cause) {
        const opts = { cause, url: ctx.safeUrl, track: ctx.track };
        if (ctx.artist !== undefined)
            opts.artist = ctx.artist;
        throw new RequestError_js_1.RequestError(`Genius network request failed: ${ctx.safeUrl}`, opts);
    }
}
/**
 * Create a Genius-backed {@link LyricsProvider} with an explicit API key.
 *
 * Flow:
 * 1. `GET {GENIUS_API_BASE}/search?q={title}[ {artist}]` with
 *    `Authorization: Bearer {apiKey}` to find the best song match.
 * 2. Fetch the matched song's `result.url` page on `genius.com`.
 * 3. Extract lyrics from every `data-lyrics-container` block, flatten
 *    HTML, and return the joined text.
 *
 * Throws:
 * - {@link KeyError} when `options.apiKey` is missing or empty, or when
 *   Genius rejects the key with HTTP 401 / 403.
 * - {@link RequestError} on transport failure or any other non-2xx
 *   response from Genius.
 *
 * Returns `null` when the search has no song hits or the matched page
 * has no recognisable lyrics container.
 */
function createGeniusProvider(options) {
    const apiKey = options?.apiKey?.trim();
    if (!apiKey) {
        throw new KeyError_js_1.KeyError('Genius API key is required. Pass `{ apiKey }` to createGeniusProvider().', { provider: 'genius', reason: 'missing' });
    }
    return {
        name: 'genius',
        async fetchLyrics({ title, artist }) {
            const query = artist ? `${title} ${artist}` : title;
            const searchUrl = `${constants_js_1.GENIUS_API_BASE}/search?q=${encodeURIComponent(query)}`;
            const searchSafeUrl = redactUrl(searchUrl);
            const searchCtx = {
                track: title,
                safeUrl: searchSafeUrl,
            };
            if (artist !== undefined)
                searchCtx.artist = artist;
            const searchRes = await safeFetch(searchUrl, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    Accept: 'application/json',
                    'User-Agent': constants_js_1.GENIUS_CLIENT_HEADER,
                },
            }, searchCtx);
            if (searchRes.status === 401 || searchRes.status === 403) {
                throw new KeyError_js_1.KeyError(`Genius rejected the API key (HTTP ${searchRes.status}). The token is wrong, revoked, or out of quota.`, { provider: 'genius', reason: 'rejected', status: searchRes.status });
            }
            if (!searchRes.ok) {
                const opts = {
                    status: searchRes.status,
                    url: searchSafeUrl,
                    track: title,
                };
                if (artist !== undefined)
                    opts.artist = artist;
                const retryAfter = parseRetryAfter(searchRes);
                if (retryAfter !== undefined)
                    opts.retryAfter = retryAfter;
                throw new RequestError_js_1.RequestError(`Genius search failed (HTTP ${searchRes.status})`, opts);
            }
            const data = (await searchRes.json());
            const hits = data.response?.hits ?? [];
            const hit = pickHit(hits, artist);
            if (!hit?.result.url)
                return null;
            const pageUrl = hit.result.url;
            const pageSafeUrl = redactToOrigin(pageUrl);
            const pageCtx = {
                track: title,
                safeUrl: pageSafeUrl,
            };
            if (artist !== undefined)
                pageCtx.artist = artist;
            const pageRes = await safeFetch(pageUrl, {
                headers: {
                    'User-Agent': constants_js_1.GENIUS_CLIENT_HEADER,
                    Accept: 'text/html',
                },
            }, pageCtx);
            if (!pageRes.ok) {
                const opts = {
                    status: pageRes.status,
                    url: pageSafeUrl,
                    track: title,
                };
                if (artist !== undefined)
                    opts.artist = artist;
                const retryAfter = parseRetryAfter(pageRes);
                if (retryAfter !== undefined)
                    opts.retryAfter = retryAfter;
                throw new RequestError_js_1.RequestError(`Genius page fetch failed (HTTP ${pageRes.status})`, opts);
            }
            const html = await pageRes.text();
            return extractLyrics(html);
        },
    };
}
/**
 * Default Genius provider — resolves the API key lazily from
 * `process.env.GENIUS_API_KEY` on every call. Prefer
 * {@link createGeniusProvider} when you want to supply the key from
 * another source (config file, secret manager, user input).
 *
 * Throws {@link KeyError} at call time when `GENIUS_API_KEY` is not
 * configured.
 */
exports.geniusProvider = {
    name: 'genius',
    async fetchLyrics(options) {
        const apiKey = readEnvKey();
        if (!apiKey) {
            throw new KeyError_js_1.KeyError('Genius API key not configured. Set GENIUS_API_KEY in the environment or call createGeniusProvider({ apiKey }).', { provider: 'genius', reason: 'missing' });
        }
        return createGeniusProvider({ apiKey }).fetchLyrics(options);
    },
};
//# sourceMappingURL=genius.js.map