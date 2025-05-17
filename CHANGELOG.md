# Changelog

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