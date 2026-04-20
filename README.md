# lyrics-lib

[![npm version](https://img.shields.io/npm/v/lyrics-lib.svg)](https://www.npmjs.com/package/lyrics-lib)
[![Node](https://img.shields.io/node/v/lyrics-lib?color=brightgreen&label=node)](https://nodejs.org)
[![Downloads](https://img.shields.io/npm/dm/lyrics-lib?label=downloads)](https://www.npmjs.com/package/lyrics-lib)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Async Node.js client for the public [LRCLIB](https://lrclib.net/) lyrics API.
Returns plain or synced lyrics for a track by title (and optional artist).
Written in TypeScript with full `.d.ts` declarations.

> **Scope:** Today, only the LRCLIB provider returns lyrics. Genius and
> Musixmatch ship as **placeholder providers** — registered and importable,
> but their `fetchLyrics` calls throw `NotImplementedError` until the real
> integrations land. See [Providers](#providers).

## Requirements

- Node.js **>= 18** (uses the global `fetch`)

## Install

```sh
npm install lyrics-lib
```

## Quick start

```ts
import { getLyrics, parseLyrics } from 'lyrics-lib';

const lyrics = await getLyrics({ title: 'Shape of You', artist: 'Ed Sheeran' });

if (lyrics) {
  console.log(lyrics);

  // Optional: split synced ([mm:ss.xx]) lines from plain lines
  const { synced, unsynced } = parseLyrics(lyrics);
  console.log(synced ?? unsynced);
} else {
  console.log('No lyrics found.');
}
```

## API

### `getLyrics(options): Promise<string | null>`

```ts
interface GetLyricsOptions {
  title: string;        // required
  artist?: string;      // recommended for accuracy
}
```

- With `artist`: hits `GET /api/get?track_name=&artist_name=` first.
- Without `artist` (or if the artist+title lookup misses): falls back to
  `GET /api/search` and uses the **first** result with no ranking — pass an
  artist when match precision matters.
- Returns `plainLyrics` if available, else `syncedLyrics`, else `null`.
- Throws `LyricsLibError("Title is required")` when `title` is empty.
- Throws `RequestError` on transport failure or non-2xx HTTP responses
  (other than 404, which is treated as "no result" and returns `null`).

### `parseLyrics(raw): ParsedLyrics`

Splits a raw LRC string into synced and unsynced lines.

```ts
interface ParsedLyrics {
  synced: { text: string; startTime: number }[] | null; // ms from start
  unsynced: { text: string }[];
}
```

`synced` is `null` when the input has no `[mm:ss.xx]` timestamps.

### Errors

All library-thrown errors extend `LyricsLibError` (which extends `Error`).

| Class            | When                                               |
| ---------------- | -------------------------------------------------- |
| `RequestError`   | Transport failure or non-2xx HTTP response         |
| `NotFoundError`  | Reserved for callers preferring exception flow     |
| `LyricsLibError` | Base class — catch this to handle all of the above |

`RequestError` exposes `.status` (HTTP status, when applicable) and `.cause`
(the underlying error, when applicable).

## Providers

The library exposes a small provider abstraction so additional sources can
be wired in without touching the public `getLyrics` surface.

```ts
import { providers, lrclibProvider, geniusProvider, musixmatchProvider, type LyricsProvider } from 'lyrics-lib';

// All registered providers, keyed by name
console.log(Object.keys(providers)); // ['lrclib', 'genius', 'musixmatch']

// Use a provider directly
const lyrics = await lrclibProvider.fetchLyrics({ title: 'Imagine', artist: 'John Lennon' });
```

| Provider               | Status         | Notes                                                |
| ---------------------- | -------------- | ---------------------------------------------------- |
| `lrclibProvider`       | ✅ implemented | Backs `getLyrics`. No API key.                       |
| `geniusProvider`       | 🟡 placeholder | Throws `NotImplementedError` until the API/scrape lands. |
| `musixmatchProvider`   | 🟡 placeholder | Throws `NotImplementedError`; will require an API key. |

The `LyricsProvider` interface is the contract — any future implementation
just needs `name: string` and `fetchLyrics(opts): Promise<string | null>`.
A `NotImplementedError` is thrown by placeholder providers and exposes
`.provider` and `.feature` so a fallback chain can skip an unavailable
source without losing diagnostic context.

`getLyrics` itself only consults LRCLIB today. A future minor release will
add an opt-in multi-provider strategy without breaking existing callers.

## How it picks lyrics

LRCLIB returns both `plainLyrics` and `syncedLyrics` per track when available.
This library prefers `plainLyrics` — if you specifically want timestamped
output, parse the result and check whether `synced` is non-null:

```ts
const raw = await getLyrics({ title, artist });
if (raw) {
  const { synced } = parseLyrics(raw);
  if (synced) {
    /* use timestamps */
  }
}
```

## Development

```sh
npm install
npm run build       # dual build → dist/esm + dist/cjs (types + source maps)
npm run typecheck   # tsc --noEmit
npm run docs        # typedoc → docs/
npm test            # vitest
```

`tsconfig.json` emits the ESM build into `dist/esm`; `tsconfig.cjs.json`
emits the CJS build into `dist/cjs`. Each includes its own `.d.ts` and
source maps. `prepublishOnly` cleans and rebuilds before any `npm publish`.

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md). Conventional Commits
(`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`).

## License

[MIT](LICENSE)
