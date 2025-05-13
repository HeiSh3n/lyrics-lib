import { fetchWithHeaders } from './fetchWithHeaders';
import { LRCLIB_API } from '../config/constants';

/**
 * Fetch lyrics for a song by its title only using the LRCLIB API.
 * @param title - The title of the song to search for.
 * @returns The lyrics as a string if found, otherwise null.
 */
export async function fetchByTitleOnly(title: string): Promise<string | null> {
  const searchParams = new URLSearchParams({ track_name: title });
  const searchUrl = `${LRCLIB_API}/search?${searchParams.toString()}`;
  const searchRes = await fetchWithHeaders(searchUrl);
  if (searchRes.ok) {
    const searchData = await searchRes.json();
    if (Array.isArray(searchData) && searchData.length > 0 && searchData[0].id) {
      const getUrl = `${LRCLIB_API}/get/${searchData[0].id}`;
      const getRes = await fetchWithHeaders(getUrl);
      if (getRes.ok) {
        const getData = await getRes.json();
        if (getData && (getData.plainLyrics || getData.syncedLyrics)) {
          return getData.plainLyrics || getData.syncedLyrics || null;
        }
      }
    }
  }
  return null;
} 