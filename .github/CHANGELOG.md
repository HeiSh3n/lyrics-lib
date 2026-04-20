# Changelog

## [2.1.0] - 2026-04-20

### Added — Genius provider (real implementation)

Upgrades the v2.0.0 `geniusProvider` placeholder to a working
integration. The library now fetches lyrics from Genius end-to-end:
searches `api.genius.com` for the best song match, fetches the song's
`genius.com` page, and extracts text from every `data-lyrics-container`
block with a native (no-cheerio) depth-tracked HTML scanner.

- **`createGeniusProvider({ apiKey })`** — factory that returns a
  `LyricsProvider` bound to an explicit API key. Use this when the key
  comes from a config file, secret manager, or user input. Throws
  `KeyError` at construction time if `apiKey` is missing or whitespace.
- **`geniusProvider`** (default export) — now reads
  `process.env.GENIUS_API_KEY` lazily on every call. No key configured
  ⇒ `KeyError` with `reason: "missing"`. Upstream rejects the key (HTTP
  401 / 403) ⇒ `KeyError` with `reason: "rejected"` and the HTTP status
  on `.status`.
- **`GeniusProviderOptions`** — exported interface describing the
  factory input.
- **`GENIUS_API_BASE`** / **`GENIUS_CLIENT_HEADER`** constants exported
  from the root barrel for advanced callers.
- **Live integration test** at `tests/genius.live.test.ts`. Skips when
  `GENIUS_API_KEY` is unset, so CI without a key runs green; enable
  locally by setting the env var. Covers the happy path, null-safe
  miss, and 401/403 `KeyError` propagation.

### Changed

- **`KeyError`** is no longer a dormant v1.x shim. It now carries
  structured context for key-related failures:
  - `reason: "missing" | "rejected"` discriminator.
  - `status?: number` — upstream HTTP status when `reason` is
    `"rejected"`.
  - `provider?: string` — `"genius"` when raised by Genius paths.

  **Constructor signature change**: was `(_error?: string)` with the
  argument silently discarded; now `(message?: string, options?:
  KeyErrorOptions)`. The v1.x no-arg `new KeyError()` call is still
  supported (default message preserved). Positional callers that
  previously relied on the message being ignored will observe the
  custom message surfacing — if your test suite asserted the exact
  hard-coded string, update the assertion.

- **`KeyErrorReason`** and **`KeyErrorOptions`** are new exported types
  for extending the error surface in downstream code.

### Notes

- Genius requires only a **Client Access Token** (from
  https://genius.com/api-clients). OAuth Client ID + Client Secret are
  **not** required — those are for user-scoped endpoints outside this
  library's scope.
- No new runtime dependencies. Native `fetch` and a regex + depth-count
  HTML walker handle the scrape; `cheerio` stays out of the tree.
- Genius pages sometimes leak metadata (contributor count, translation
  nav, "... Lyrics" title, "Read More" description blurb) into the
  `data-lyrics-container` block. A `stripGeniusMetadata` post-filter
  removes this: it prefers slicing from the first `[Section]` marker
  (Genius's canonical lyric structure tag), and falls back to a
  targeted heuristic that drops recognised noise lines from the top
  when no section marker exists. The section-marker path is robust;
  the fallback is best-effort and may need adjusting if Genius
  restructures the page.

### Version bump

`package.json` → `"version": "2.1.0"` and `LIBRARY_VERSION` in
`src/config/constants.ts` → `'2.1.0'` (kept in lockstep — both the
`Lrclib-Client` and Genius `User-Agent` headers embed this string for
upstream rate-limit identity). Semver MINOR — adds new API surface
(`createGeniusProvider`, `GeniusProviderOptions`, `KeyErrorReason`,
`KeyErrorOptions`, `GENIUS_API_BASE`, `GENIUS_CLIENT_HEADER`) and
evolves `KeyError` with new optional fields; no removals.

### Migration

Two behavior shifts that existing 2.0.0 callers should audit:

- **`geniusProvider.fetchLyrics` no longer throws
  `NotImplementedError`.** In 2.0.0 every call threw
  `NotImplementedError`; in 2.1.0 it either (a) throws
  `KeyError { reason: "missing" }` when `process.env.GENIUS_API_KEY`
  is unset, or (b) performs a real live-network lookup and returns
  `string | null` when the key is set. Any fallback chain that
  filtered providers by `instanceof NotImplementedError` will
  silently stop skipping Genius — switch to checking both classes
  (or better: check `provider.name === 'genius'` against a known
  unavailable-providers list). The `musixmatchProvider` still throws
  `NotImplementedError` unchanged.

- **`KeyError(message)` now surfaces `message` on the thrown error.**
  In 2.0.0 the constructor silently discarded its argument and always
  emitted `"The key has not been configured."`; in 2.1.0 the
  argument becomes the error `.message`. The no-arg `new KeyError()`
  form is unchanged (default message preserved), and `instanceof
  KeyError` checks still work. Callers that asserted the exact hard-
  coded string on `e.message` need to loosen the assertion or match
  on the new structured `.reason` / `.provider` / `.status` fields
  instead.

### Security / privacy

- **`RequestError.url` is now redacted** for Genius throws — the
  search URL's `?q=title+artist` query string is stripped before
  assignment so user-supplied search terms don't leak into logs via
  the URL field. Structured `.track` and `.artist` still carry the
  same data for intentional callers.
- **`RequestError.retryAfter`** (new optional `number` field, in
  seconds) is populated from upstream `Retry-After` headers on 429
  and 503 responses. Supports both delta-seconds and HTTP-date
  values per RFC 7231 §7.1.3.

### Extractor hardening

- HTML comments, `<script>` bodies, and `<style>` bodies are
  stripped from the page before the `data-lyrics-container` div-
  depth scanner runs — prevents `<div` / `</div>` tokens inside
  those blocks from corrupting depth tracking.
- Entity decoding covers numeric (`&#<dec>;`, `&#x<hex>;`) and
  curated named entities (`&rsquo;`, `&ldquo;`, `&rdquo;`,
  `&mdash;`, `&ndash;`, `&hellip;`, plus the XML core set).
- `stripGeniusMetadata` section-marker anchor is restricted to a
  whitelist of known Genius labels (Intro / Verse / Chorus / Bridge
  / Outro / Pre-Chorus / Post-Chorus / Refrain / Hook / Interlude /
  Breakdown / Break / Build / Drop / Coda / Skit / Spoken /
  Instrumental / Guitar/Drum/Bass/Piano Solo / Part) with optional
  numeric suffix and `: annotation`. Lines like `[?]` or
  `[hook intro]` no longer trigger a false slice. Fallback anchors
  on "Read More"; returns text unchanged if neither anchor is
  found, rather than running the old per-line heuristic that could
  eat real lyric lines.

## [2.0.0] - 2026-04-19

Major release. Full library refactor for publish-readiness, type-safety,
and consistent error semantics.

### Breaking changes

- **`package.json`**: dual-build layout with `main` → `./dist/cjs/index.js`,
  `module` → `./dist/esm/index.js`, `types` → `./dist/esm/index.d.ts`, and
  a conditional `exports` map. Pre-2.0.0 `main` pointed at `index.js` which
  did not exist; 1.0.6 added `main/module/types/exports` pointing at
  `dist/esm/**` but shipped no ESM files, so ESM consumers got a
  resolution error. 2.0.0 ships a genuinely working dual build.
- **TypeScript declarations**: real `.d.ts` + source maps emitted for both
  the ESM build (`dist/esm`) and the CJS build (`dist/cjs`). `files`
  allowlist restricts publish to `dist`, `README.md`, `LICENSE`.
- **Error semantics**: `fetchWithHeaders`, `fetchByTrackAndArtist`, and
  `fetchByTitleOnly` now **throw** `RequestError` on transport failure or
  non-2xx, non-404 HTTP responses. Previously these were silently
  swallowed and returned `null`. `null` is now reserved for "no result".
- **Validation errors**: `getLyrics({title: ''})` now throws
  `LyricsLibError('Title is required')` instead of a plain `Error`.
- **`cheerio` removed** from dependencies — the unused Genius scraper
  `.js` files in `src/` were deleted.
- **Deep subpath imports are no longer supported.** The new `exports` map
  is strict — only `import 'lyrics-lib'` and `import 'lyrics-lib/package.json'`
  are valid. Call sites that previously reached in via
  `lyrics-lib/dist/index.js`, `lyrics-lib/dist/utils/parseLyrics`, or any
  other `dist/**` path must switch to the top-level import. The symbols
  are all re-exported from the root barrel.

### Added

- `LyricsLibError` base class — all library-thrown errors extend it.
- `RequestError` exposes structured fields: `status`, `url`, `track`,
  `artist`, plus `cause` for the underlying error.
- `parseLyrics` is now part of the public barrel
  (`import { parseLyrics } from 'lyrics-lib'`); the deep-import
  workaround is no longer needed.
- `LrclibTrack` interface for typed LRCLIB API responses.
- `LIBRARY_VERSION` constant — single source of truth for the
  `Lrclib-Client` request header.
- `tsconfig.json` hardened: `strict`, `noUncheckedIndexedAccess`,
  `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`,
  `noFallthroughCasesInSwitch`, plus `declaration`, `declarationMap`,
  `sourceMap`.
- `package.json` scripts: `build`, `build:esm`, `build:cjs`, `clean`, `typecheck`,
  `test` (vitest, `--passWithNoTests`), `test:watch`, `prepublishOnly`.
- Vitest specs at `tests/parseLyrics.test.ts` and
  `tests/providers.test.ts` (14 tests total). The runner is wired up
  and ready for further coverage work.

### Added — Provider scaffolding

Groundwork for future multi-source support. Only the LRCLIB provider is
live today; Genius and Musixmatch ship as placeholders.

- `LyricsProvider` interface — `{ name: string; fetchLyrics(opts):
  Promise<string | null> }`. Any future source implements this contract.
- `lrclibProvider` — full implementation. Wraps the existing
  `fetchByTrackAndArtist` / `fetchByTitleOnly` flow and backs `getLyrics`.
- `geniusProvider` — **placeholder**. Throws `NotImplementedError` on
  every call until the real Genius integration lands.
- `musixmatchProvider` — **placeholder**. Throws `NotImplementedError`;
  will require an API key at factory time when implemented.
- `providers` — frozen registry keyed by provider name
  (`providers.lrclib`, `providers.genius`, `providers.musixmatch`).
- `NotImplementedError` — carries `.provider` and optional `.feature`
  so fallback chains can skip an unavailable source with context.
- `getLyrics` behavior is **unchanged** — it still consults only
  LRCLIB. A future minor release will add an opt-in multi-provider
  chain without breaking existing callers.

### Deprecated

These v1.x symbols stay in the public surface as no-op shims so existing
source keeps compiling. They are marked `@deprecated` to steer new code
toward the recommended replacements, but there is no planned removal —
they are kept for compatibility. If the future Genius / Musixmatch
providers need any of this behavior back (for example, when API-key
handling lands), the library will reuse or extend these symbols rather
than introduce a parallel surface.

- `KeyError` — not thrown by any code path today. Kept available so
  existing `try { ... } catch (e) { if (e instanceof KeyError) ... }`
  call sites keep working, and so the future keyed providers can reuse
  it for key-related failures if that fits.
- `NoResultError` — `getLyrics` returns `null` for "no result" instead
  of throwing; use `NotFoundError` for the exception-based path.
- `fetchWithHeaders` — internal helper, not part of the stable surface.
- `LyricsQuery`, `LyricsResult` types — superseded by
  `GetLyricsOptions` and `LrclibTrack`.

### Migration

Most v1.x callers need no changes. Watch out for:

- If you wrapped `getLyrics` in a `try`/`catch` that expected `null` on
  network failure, you now need to handle a thrown `RequestError`. Check
  `.status` and `.cause` to distinguish transport failure from 5xx.
- If you imported `parseLyrics` via `lyrics-lib/dist/utils/parseLyrics`,
  switch to `import { parseLyrics } from 'lyrics-lib'`.

## [1.0.6] - 2025-07-08

### Added
- **Dual module support:** The library now builds and publishes both ESM and CommonJS outputs for maximum compatibility with Node.js and modern bundlers.
- **New build scripts:** Added `build:esm`, `build:cjs`, and updated `build` script to generate both module types.

### Changed
- **package.json:**  
  - Set `main` to `dist/cjs/index.js` (CommonJS entry).
  - Set `module` to `dist/esm/index.js` (ESM entry).
  - Set `types` to `dist/esm/index.d.ts`.
  - Added `exports` field for proper Node.js and bundler resolution.

### Fixed
- Consumers can now use either:
  - `import { getLyrics } from 'lyrics-lib'` (ESM)
  - `const { getLyrics } = require('lyrics-lib')` (CommonJS)

## [1.0.5] - 2025-05-17

### Added
- Integrated TypeDoc for API documentation generation.
- Added /docs/ and .typedoc/ to .gitignore to exclude generated documentation from version control.

## [1.0.4] - 2025-05-14

### Changed
- The codebase is now pure TypeScript in the src/ directory; all .js files have been removed from source.
- Clarified that the dist/ directory contains only build artifacts (.js, .d.ts) as per TypeScript best practices and should not be manually edited or deleted.

## [1.0.3] - 2025-05-14

### Fixed
- Corrected the GitHub repository URL in package.json to https://github.com/HeiSh3n/lyrics-lib

## [1.0.2] - 2025-05-14

### Added
- Added `engines` field to package.json to require Node.js >=18.0.0.
- Added `repository` field to package.json to link to the GitHub repository.

## [1.0.1] - 2025-05-14

### Changed
- Updated license in package.json from ISC to MIT to match the intended project license.

## [1.0.0] - 2025-05-13

### 🎉 Initial Release

- First stable release of `lyrics-lib`!
- Fetch lyrics for any song by title (artist is optional).
- Multi-language support (as supported by lrclib).
- No API keys required—uses the public [lrclib API](https://lrclib.net/).
- Simple, modern API:
  ```js
  const lyrics = await getLyrics({ title, artist? })
  ```
- Written in TypeScript for type safety and modern development.
- Designed for easy integration into music bots and applications.
- Extensible architecture for future adapters and providers.
- Includes documentation, example usage, and support section. 