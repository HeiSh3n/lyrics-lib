import { fetchByTrackAndArtist } from './fetchByTrackAndArtist';
import { fetchByTitleOnly } from './fetchByTitleOnly';

/**
 * Options for fetching lyrics, including song title and optional artist.
 */
export interface GetLyricsOptions {
  title: string;
  artist?: string;
}

/**
 * Fetch lyrics for a song by title and optionally artist. Tries artist+title first, then falls back to title only.
 * @param options - The options containing the song title and optional artist.
 * @returns The lyrics as a string if found, otherwise null.
 */
export async function getLyrics({ title, artist }: GetLyricsOptions): Promise<string | null> {
  if (!title) throw new Error('Title is required');
  if (artist) {
    const result = await fetchByTrackAndArtist(title, artist);
    if (result) return result;
  }
  return await fetchByTitleOnly(title);
} 