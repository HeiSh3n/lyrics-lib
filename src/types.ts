/**
 * Options accepted by {@link getLyrics}.
 */
export interface GetLyricsOptions {
  /** Track title. Required. */
  title: string;
  /** Artist name. Improves match precision; falls back to title-only search if omitted. */
  artist?: string;
}

/**
 * Shape of a track record returned by the LRCLIB API
 * (`GET /api/get`, `GET /api/get/:id`, and items inside `GET /api/search`).
 *
 * Only the fields this library reads are typed strictly; the rest are optional
 * because LRCLIB may add fields without notice.
 */
export interface LrclibTrack {
  id: number;
  trackName?: string;
  artistName?: string;
  albumName?: string;
  duration?: number;
  instrumental?: boolean;
  plainLyrics?: string | null;
  syncedLyrics?: string | null;
}

/**
 * A single lyric line. `startTime` is set only for synced (timestamped) lines.
 */
export interface LyricLine {
  text: string;
  /** Milliseconds from the start of the track. */
  startTime?: number;
}

/**
 * Result of {@link parseLyrics}. `synced` is `null` when the input has no timestamps.
 */
export interface ParsedLyrics {
  synced: LyricLine[] | null;
  unsynced: LyricLine[];
}

/**
 * @deprecated Since v2.0.0. Use {@link GetLyricsOptions} for the
 * `getLyrics` input shape. Kept as a type alias for source compatibility;
 * no removal is planned.
 */
export type LyricsQuery =
  | { id?: never; title: string; artist?: string; album?: string; duration?: number }
  | { id: number; title?: never; artist?: never; album?: never; duration?: never };

/**
 * @deprecated Since v2.0.0. Use {@link LrclibTrack}. Kept as a type alias
 * for source compatibility; no removal is planned.
 */
export interface LyricsResult {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number;
  instrumental: boolean;
  plainLyrics: string | null;
  syncedLyrics: string | null;
  error?: { code: number; name: string; message: string };
}
