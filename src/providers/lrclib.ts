import { fetchByTitleOnly } from '../core/fetchByTitleOnly.js';
import { fetchByTrackAndArtist } from '../core/fetchByTrackAndArtist.js';
import type { GetLyricsOptions } from '../types.js';
import type { LyricsProvider } from './types.js';

/**
 * LRCLIB provider — the real implementation backing {@link getLyrics}.
 *
 * Behavior matches `getLyrics` exactly: tries an exact title + artist
 * lookup first when an artist is provided, then falls back to a
 * title-only search.
 */
export const lrclibProvider: LyricsProvider = {
  name: 'lrclib',

  async fetchLyrics({ title, artist }: GetLyricsOptions): Promise<string | null> {
    if (artist) {
      const exact = await fetchByTrackAndArtist(title, artist);
      if (exact) return exact;
    }
    return fetchByTitleOnly(title);
  },
};
