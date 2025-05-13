import { fetchWithHeaders } from './fetchWithHeaders';
import { LRCLIB_API } from '../config/constants';

/**
 * Fetch lyrics for a song by both its title and artist using the LRCLIB API.
 * @param title - The title of the song to search for.
 * @param artist - The artist of the song to search for.
 * @returns The lyrics as a string if found, otherwise null.
 */
export async function fetchByTrackAndArtist(title: string, artist: string): Promise<string | null> {
  const params = new URLSearchParams({ track_name: title, artist_name: artist });
  const url = `${LRCLIB_API}/get?${params.toString()}`;
  const res = await fetchWithHeaders(url);
  if (res.ok) {
    const data = await res.json();
    if (data && (data.plainLyrics || data.syncedLyrics)) {
      return data.plainLyrics || data.syncedLyrics || null;
    }
  }
  return null;
} 