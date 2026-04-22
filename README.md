# lyrics-lib

[![npm version](https://img.shields.io/npm/v/lyrics-lib.svg)](https://www.npmjs.com/package/lyrics-lib)
[![Node](https://img.shields.io/node/v/lyrics-lib?color=brightgreen&label=node)](https://nodejs.org)
[![Downloads](https://img.shields.io/npm/dm/lyrics-lib?label=downloads)](https://www.npmjs.com/package/lyrics-lib)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Async Node.js client for the public [LRCLIB](https://lrclib.net/) lyrics API.
Returns plain or synced lyrics for a track by title (and optional artist).
Written in TypeScript with full `.d.ts` declarations.

> **Scope:** LRCLIB and Genius are fully implemented. Musixmatch ships as a
> **placeholder provider** — registered and importable, but its `fetchLyrics`
> call throws `NotImplementedError` until the real integration lands.
> See [Providers](#providers).

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

| Class                  | When                                                                    |
| ---------------------- | ----------------------------------------------------------------------- |
| `RequestError`         | Transport failure or non-2xx HTTP response                              |
| `KeyError`             | API key missing or rejected by upstream (e.g. Genius 401/403)           |
| `NotImplementedError`  | Called a provider whose integration hasn't shipped (e.g. Musixmatch)    |
| `NotFoundError`        | Reserved for callers preferring exception flow                          |
| `LyricsLibError`       | Base class — catch this to handle all of the above                      |

- `RequestError` exposes `.status` (HTTP status, when applicable) and
  `.cause` (the underlying error, when applicable).
- `KeyError` exposes `.reason` (`"missing"` — not configured;
  `"rejected"` — upstream refused the key), `.status` (upstream HTTP
  status when `reason` is `"rejected"`), and `.provider` (e.g.
  `"genius"`). Use `.reason` to decide whether to prompt the user for
  a key vs. surface a hard failure.

## Providers

The library exposes a small provider abstraction so additional sources can
be wired in without touching the public `getLyrics` surface.

```ts
import {
  providers,
  lrclibProvider,
  geniusProvider,
  createGeniusProvider,
  musixmatchProvider,
  type LyricsProvider,
} from 'lyrics-lib';

// All registered providers, keyed by name
console.log(Object.keys(providers)); // ['lrclib', 'genius', 'musixmatch']

// Use a provider directly
const lyrics = await lrclibProvider.fetchLyrics({ title: 'Imagine', artist: 'John Lennon' });
```

| Provider               | Status         | Notes                                                                     |
| ---------------------- | -------------- | ------------------------------------------------------------------------- |
| `lrclibProvider`       | ✅ implemented | Backs `getLyrics`. No API key.                                             |
| `geniusProvider`       | ✅ implemented | Client Access Token required. Reads `process.env.GENIUS_API_KEY` by default. |
| `musixmatchProvider`   | 🟡 placeholder | Throws `NotImplementedError`; will require an API key.                     |

The `LyricsProvider` interface is the contract — any future implementation
just needs `name: string` and `fetchLyrics(opts): Promise<string | null>`.
A `NotImplementedError` is thrown by placeholder providers and exposes
`.provider` and `.feature` so a fallback chain can skip an unavailable
source without losing diagnostic context.

`getLyrics` itself only consults LRCLIB today. A future minor release will
add an opt-in multi-provider strategy without breaking existing callers.

### Using the Genius provider

Get a **Client Access Token** from
[genius.com/api-clients](https://genius.com/api-clients) (OAuth Client
ID + Client Secret are *not* required — those are for user-scoped
endpoints outside this library's scope).

Two ways to supply the key:

**1. Environment variable (simplest)** — the default `geniusProvider`
reads `process.env.GENIUS_API_KEY` lazily on every call:

```ts
import { geniusProvider } from 'lyrics-lib';

// export GENIUS_API_KEY=... in your shell, or load via a .env loader
const lyrics = await geniusProvider.fetchLyrics({
  title: 'Bohemian Rhapsody',
  artist: 'Queen',
});
```

**2. Explicit factory (for config files / secret managers / user
input)** — pass the key to `createGeniusProvider`:

```ts
import { createGeniusProvider } from 'lyrics-lib';

const genius = createGeniusProvider({ apiKey: process.env.MY_GENIUS_TOKEN! });
const lyrics = await genius.fetchLyrics({ title: 'Hotel California', artist: 'Eagles' });
```

**Error handling** — key failures raise `KeyError` with a `reason`
discriminator so callers can tell configuration gaps from upstream
rejections:

```ts
import { KeyError, geniusProvider } from 'lyrics-lib';

try {
  const lyrics = await geniusProvider.fetchLyrics({ title: 'Imagine' });
} catch (e) {
  if (e instanceof KeyError) {
    if (e.reason === 'missing') {
      // Prompt the user for a key, load from config, etc.
    } else if (e.reason === 'rejected') {
      // e.status is the upstream 401/403. Key is wrong, revoked, or out of quota.
    }
  }
}
```

Other failure modes (non-2xx from Genius, network errors) surface as
`RequestError`. `fetchLyrics` returns `null` when the search has no
song hits.

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

## Repobeats

![Alt](https://repobeats.axiom.co/api/embed/3315917123481ba2fb6c2df44c733eed59af059b.svg "Repobeats analytics image")

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md). Conventional Commits
(`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`).

## License

[MIT](LICENSE)
