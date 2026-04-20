import { NotImplementedError } from '../errors/NotImplementedError.js';
import type { GetLyricsOptions } from '../types.js';
import type { LyricsProvider } from './types.js';

/**
 * Genius provider — **placeholder**. Throws {@link NotImplementedError}
 * on every call until the real implementation lands.
 *
 * Planned approach (TODO): use the official Genius API
 * (`https://api.genius.com/search`) when an API key is provided, with
 * page-scrape fallback. The previous v1.x scraper used `axios` + `cheerio`;
 * the v2.x replacement should reuse the project's native `fetch` helper
 * (see `src/core/fetchWithHeaders.ts`) and keep `cheerio` opt-in.
 */
export const geniusProvider: LyricsProvider = {
  name: 'genius',

  async fetchLyrics(_options: GetLyricsOptions): Promise<string | null> {
    throw new NotImplementedError('genius', 'fetchLyrics');
  },
};
