import { NotImplementedError } from '../errors/NotImplementedError.js';
import type { GetLyricsOptions } from '../types.js';
import type { LyricsProvider } from './types.js';

/**
 * Musixmatch provider — **placeholder**. Throws {@link NotImplementedError}
 * on every call until the real implementation lands.
 *
 * Planned approach (TODO): integrate with the Musixmatch API
 * (`https://api.musixmatch.com/ws/1.1/`). Requires an API key supplied at
 * construction time — the placeholder intentionally accepts no config so
 * the future implementation can introduce a `createMusixmatchProvider({
 * apiKey })` factory without breaking the stub's signature.
 */
export const musixmatchProvider: LyricsProvider = {
  name: 'musixmatch',

  async fetchLyrics(_options: GetLyricsOptions): Promise<string | null> {
    throw new NotImplementedError('musixmatch', 'fetchLyrics');
  },
};
