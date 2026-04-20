import type { LyricsProvider } from './types.js';
/**
 * Configuration for {@link createGeniusProvider}.
 *
 * The Genius API requires authentication on every call. Create a client
 * at https://genius.com/api-clients and supply the **Client Access
 * Token** as `apiKey`. Keep the token out of version control — read it
 * from an environment variable, secret manager, or user-supplied config
 * at runtime.
 */
export interface GeniusProviderOptions {
    /** Genius Client Access Token. Required and non-empty. */
    apiKey: string;
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
export declare function createGeniusProvider(options: GeniusProviderOptions): LyricsProvider;
/**
 * Default Genius provider — resolves the API key lazily from
 * `process.env.GENIUS_API_KEY` on every call. Prefer
 * {@link createGeniusProvider} when you want to supply the key from
 * another source (config file, secret manager, user input).
 *
 * Throws {@link KeyError} at call time when `GENIUS_API_KEY` is not
 * configured.
 */
export declare const geniusProvider: LyricsProvider;
//# sourceMappingURL=genius.d.ts.map