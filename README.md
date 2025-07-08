<p align="center">
  <img src="https://nodei.co/npm/lyrics-lib.png?downloads=true&downloadRank=true&stars=true" alt="npm install lyrics-lib" />
</p>

<p align="center">
  <img src="https://img.shields.io/node/v/lyrics-lib?color=brightgreen&label=node" alt="Node Version" />
  <img src="https://img.shields.io/npm/dm/lyrics-lib?label=downloads" alt="Downloads" />
  <img src="https://img.shields.io/github/stars/HeiSh3n/lyrics-lib?style=social" alt="GitHub stars" />
</p>

<p align="center">
  <a href="https://ko-fi.com/your-kofi-username" target="_blank">
    <img src="https://ko-fi.com/img/githubbutton_sm.svg" alt="Buy Me a Coffee" />
  </a>
</p>

# lyrics-lib

**lyrics-lib** is a modern, extensible Node.js library for fetching song lyrics from multiple sources (Genius, Musixmatch, LRC, and more).  
It supports multiple languages and is designed for easy integration into bots, apps, and music tools.

## ✨ Features

- **Easy Integration:** Simple, modern API for fetching lyrics by title and/or artist.
- **Multi-language Support:** Works with songs in many languages.
- **Multiple Sources:** Fetches from Genius, Musixmatch, LRC, and more.
- **No API Key Required:** Scrapes if no key is provided.
- **TypeScript Support:** Written in TypeScript for type safety.
- **Extensible:** Easily add new providers or adapters.

## 📦 Requirements

- Node.js >= 18.0.0

## 🚀 Installation

```sh
npm install lyrics-lib
```

## 🛠️ Usage

```ts
import { getLyrics } from 'lyrics-lib';
// Optionally, for parsing synced/unsynced lines:
import { parseLyrics } from 'lyrics-lib/dist/utils/parseLyrics'; // See note below

async function main() {
  // Fetch lyrics by title and artist (recommended)
  const lyrics = await getLyrics({ title: 'Shape of You', artist: 'Ed Sheeran' });

  if (lyrics) {
    console.log('Lyrics found:\n', lyrics);

    // Optionally parse into synced/unsynced lines
    const parsed = parseLyrics(lyrics);
    console.log('Parsed:', parsed);
  } else {
    console.log('No lyrics found for this song.');
  }
}

main().catch(console.error);
```

> **Note:**  
> - `getLyrics({ title, artist? })` returns the lyrics as a string, or `null` if not found.  
> - You can also call `getLyrics({ title })` with just a title; it will try to find the best match.
> - To use `parseLyrics`, import directly from `lyrics-lib/dist/utils/parseLyrics` (until a public utils export is added).
> - All functions are async and require Node.js 18+ (for native fetch).

## 📚 Documentation

See the [API documentation](./docs/index.html) for full details.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](.github/CONTRIBUTING.md) before submitting a pull request.

## 📄 License

[MIT](LICENSE)

## 💖 Support

<p align="center">
  <a href="https://ko-fi.com/your-kofi-username" target="_blank">
    <img src="https://ko-fi.com/img/githubbutton_sm.svg" alt="Buy Me a Coffee" />
  </a>
</p>
