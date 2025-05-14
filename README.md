# lyrics-lib

A library for fetching song lyrics, designed for easy integration into music-related applications and bots.

## Features
- Fetch lyrics for songs by title (artist is optional)
- Multi-language support (as supported by lrclib)
- Extensible and easy to use
- Written in TypeScript for type safety
- No API keys required (uses the public [lrclib API](https://lrclib.net/))

## Installation
```sh
npm install lyrics-lib
```

## Example Usage
```js
import { getLyrics } from 'lyrics-lib';

// With both title and artist
const lyrics1 = await getLyrics({ title: 'Shape of You', artist: 'Ed Sheeran' });
console.log(lyrics1);

// With only title (artist is optional)
const lyrics2 = await getLyrics({ title: 'Yesterday' });
console.log(lyrics2);
```

## 💖 Support
[![Buy Me a Coffee](https://cdn.ko-fi.com/cdn/kofi_button.png?v=3)](https://ko-fi.com/heishen)

## License
Licensed under the [MIT License](LICENSE)
