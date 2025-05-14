import { fetchByTrackAndArtist } from './fetchByTrackAndArtist';
import { fetchByTitleOnly } from './fetchByTitleOnly';

export interface GetLyricsOptions {
  title: string;
  artist?: string;
}

export async function getLyrics({ title, artist }: GetLyricsOptions): Promise<string | null> {
  if (!title) throw new Error('Title is required');
  if (artist) {
    const result = await fetchByTrackAndArtist(title, artist);
    if (result) return result;
  }
  return await fetchByTitleOnly(title);
} 