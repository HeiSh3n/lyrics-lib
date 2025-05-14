import { fetchWithHeaders } from './fetchWithHeaders';
import { LRCLIB_API } from '../config/constants';

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