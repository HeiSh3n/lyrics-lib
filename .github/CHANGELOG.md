# Changelog

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