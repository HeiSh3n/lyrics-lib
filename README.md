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

// Fetch lyrics for any song. 'artist' is optional.
const lyrics = await getLyrics({
  title: 'Your Song Title', // required
  // artist: 'Artist Name', // optional
});
console.log(lyrics);
```

## 💖 Support
[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/heishen)

## License
Licensed under the [MIT License](LICENSE)
