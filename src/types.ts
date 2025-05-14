export type LyricsQuery =
  | {
      id?: never;
      title: string;
      artist?: string;
      album?: string;
      duration?: number;
    }
  | {
      id: number;
      title?: never;
      artist?: never;
      album?: never;
      duration?: never;
    };

export interface LyricsResult {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number;
  instrumental: boolean;
  plainLyrics: string | null;
  syncedLyrics: string | null;
  error?: {
    code: number;
    name: string;
    message: string;
  };
}

export interface LyricLine {
  text: string;
  startTime?: number; // Only for synced lines
}

export interface ParsedLyrics {
  synced: LyricLine[] | null;
  unsynced: LyricLine[];
} 