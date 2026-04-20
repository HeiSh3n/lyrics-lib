import { afterEach, describe, expect, it, vi } from 'vitest';
import { KeyError, RequestError, createGeniusProvider } from '../src';

function mockFetch(
  pageHtml: string,
  searchHits: unknown = [
    { type: 'song', result: { id: 1, url: 'https://genius.com/test-song-lyrics' } },
  ],
): void {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) => {
      if (url.includes('api.genius.com/search')) {
        return new Response(JSON.stringify({ response: { hits: searchHits } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(pageHtml, {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      });
    }),
  );
}

function mockSearchNonOk(
  status: number,
  headers: Record<string, string> = {},
): void {
  vi.stubGlobal(
    'fetch',
    vi.fn(
      async () =>
        new Response('search failed', {
          status,
          headers: { 'Content-Type': 'text/plain', ...headers },
        }),
    ),
  );
}

function mockSearchOkPageNonOk(
  pageStatus: number,
  headers: Record<string, string> = {},
): void {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) => {
      if (url.includes('api.genius.com/search')) {
        return new Response(
          JSON.stringify({
            response: {
              hits: [
                { type: 'song', result: { id: 1, url: 'https://genius.com/test-song-lyrics' } },
              ],
            },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        );
      }
      return new Response('page failed', {
        status: pageStatus,
        headers: { 'Content-Type': 'text/html', ...headers },
      });
    }),
  );
}

describe('genius extract — metadata stripping', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('slices from the first [Section] marker when present', async () => {
    mockFetch(
      `<html><body><div data-lyrics-container="true">` +
        `516 Contributors<br>Bohemian Rhapsody Lyrics<br><br>` +
        `Widely considered to be one of the greatest songs of all time, ` +
        `this song…Read More<br><br>` +
        `[Intro]<br>Is this the real life?<br>Is this just fantasy?<br>` +
        `[Verse 1]<br>Mama, just killed a man<br>` +
        `</div></body></html>`,
    );
    const lyrics = await createGeniusProvider({ apiKey: 'test' }).fetchLyrics({
      title: 'Bohemian Rhapsody',
    });
    expect(lyrics).not.toBeNull();
    expect(lyrics!.startsWith('[Intro]')).toBe(true);
    expect(lyrics).not.toMatch(/Contributor/);
    expect(lyrics).not.toMatch(/Read More/);
    expect(lyrics).not.toMatch(/Bohemian Rhapsody Lyrics/);
    expect(lyrics).toContain('Mama, just killed a man');
  });

  it('leaves lyrics untouched when the first line is already a section marker', async () => {
    mockFetch(
      `<div data-lyrics-container="true">[Intro]<br>Line one<br>Line two<br></div>`,
    );
    const lyrics = await createGeniusProvider({ apiKey: 'test' }).fetchLyrics({ title: 'x' });
    expect(lyrics).toBe('[Intro]\nLine one\nLine two');
  });

  it('falls back to line-by-line header strip when no section markers exist', async () => {
    mockFetch(
      `<div data-lyrics-container="true">` +
        `12 Contributors<br>Test Song Lyrics<br>` +
        `A really cool description…Read More<br><br>` +
        `La la la<br>Whoa oh oh<br>Here come the lyrics<br>` +
        `</div>`,
    );
    const lyrics = await createGeniusProvider({ apiKey: 'test' }).fetchLyrics({ title: 'x' });
    expect(lyrics).not.toBeNull();
    expect(lyrics).not.toMatch(/Contributor/);
    expect(lyrics).not.toMatch(/Read More/);
    expect(lyrics).not.toMatch(/Test Song Lyrics/);
    expect(lyrics!.startsWith('La la la')).toBe(true);
  });

  it('returns clean lyrics when the container has no metadata at all', async () => {
    mockFetch(`<div data-lyrics-container="true">Just a line<br>Another line<br></div>`);
    const lyrics = await createGeniusProvider({ apiKey: 'test' }).fetchLyrics({ title: 'x' });
    expect(lyrics).toBe('Just a line\nAnother line');
  });

  it('returns null when no lyrics container exists on the page', async () => {
    mockFetch(`<html><body><p>No lyrics here.</p></body></html>`);
    const lyrics = await createGeniusProvider({ apiKey: 'test' }).fetchLyrics({ title: 'x' });
    expect(lyrics).toBeNull();
  });

  it('returns null when search has no song hits', async () => {
    mockFetch('', []);
    const lyrics = await createGeniusProvider({ apiKey: 'test' }).fetchLyrics({ title: 'x' });
    expect(lyrics).toBeNull();
  });
});

describe('genius extract — HTML noise safety', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('ignores </div> tokens inside HTML comments (does not prematurely close container)', async () => {
    mockFetch(
      `<div data-lyrics-container="true">` +
        `<!-- this comment contains </div> and should not confuse the scanner -->` +
        `[Intro]<br>Line one<br>Line two<br>` +
        `</div>` +
        `<p>Outside the container — should not appear.</p>`,
    );
    const lyrics = await createGeniusProvider({ apiKey: 'test' }).fetchLyrics({ title: 'x' });
    expect(lyrics).not.toBeNull();
    expect(lyrics).toContain('Line one');
    expect(lyrics).toContain('Line two');
    expect(lyrics).not.toContain('Outside the container');
  });

  it('ignores <div tokens inside <script> bodies (does not inflate depth)', async () => {
    mockFetch(
      `<script>var x = "<div class='trap'>"; var y = "</div>";</script>` +
        `<div data-lyrics-container="true">[Intro]<br>Real lyric<br></div>` +
        `<p>After the container</p>`,
    );
    const lyrics = await createGeniusProvider({ apiKey: 'test' }).fetchLyrics({ title: 'x' });
    expect(lyrics).not.toBeNull();
    expect(lyrics).toContain('Real lyric');
    expect(lyrics).not.toContain('trap');
    expect(lyrics).not.toContain('After the container');
  });

  it('ignores <div tokens inside <style> bodies', async () => {
    mockFetch(
      `<style>div[data-x="</div>"] { color: red; }</style>` +
        `<div data-lyrics-container="true">[Intro]<br>Styled lyric<br></div>`,
    );
    const lyrics = await createGeniusProvider({ apiKey: 'test' }).fetchLyrics({ title: 'x' });
    expect(lyrics).not.toBeNull();
    expect(lyrics).toContain('Styled lyric');
  });
});

describe('genius extract — entity decoding', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('decodes numeric entities (decimal and hex)', async () => {
    mockFetch(
      `<div data-lyrics-container="true">` +
        `[Intro]<br>` +
        // &#8217; = right single quote, &#x2014; = em dash
        `It&#8217;s fine&#x2014;really<br>` +
        `</div>`,
    );
    const lyrics = await createGeniusProvider({ apiKey: 'test' }).fetchLyrics({ title: 'x' });
    expect(lyrics).toContain('It\u2019s fine\u2014really');
  });

  it('decodes curated named entities (rsquo, ldquo, rdquo, mdash, ndash, hellip)', async () => {
    mockFetch(
      `<div data-lyrics-container="true">` +
        `[Intro]<br>` +
        `She said &ldquo;hi&rdquo; &mdash; &ndash; it&rsquo;s late&hellip;<br>` +
        `</div>`,
    );
    const lyrics = await createGeniusProvider({ apiKey: 'test' }).fetchLyrics({ title: 'x' });
    expect(lyrics).toContain('She said \u201Chi\u201D \u2014 \u2013 it\u2019s late\u2026');
  });
});

describe('genius extract — section marker whitelist', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('does NOT treat [?] as a section marker (preserves the line)', async () => {
    mockFetch(
      `<div data-lyrics-container="true">` +
        `12 Contributors<br>Test Song Lyrics<br>` +
        `Description…Read More<br><br>` +
        `[?]<br>First lyric line<br>` +
        `</div>`,
    );
    const lyrics = await createGeniusProvider({ apiKey: 'test' }).fetchLyrics({ title: 'x' });
    // "Read More" fallback kicks in, then the rest starts with [?]
    expect(lyrics).not.toBeNull();
    expect(lyrics!.startsWith('[?]')).toBe(true);
    expect(lyrics).toContain('First lyric line');
    expect(lyrics).not.toContain('Contributor');
    expect(lyrics).not.toContain('Test Song Lyrics');
  });

  it('does NOT treat [hook intro] (lowercase) as a section marker', async () => {
    mockFetch(
      `<div data-lyrics-container="true">` +
        `5 Contributors<br>Sample Lyrics<br>` +
        `Blurb…Read More<br><br>` +
        `[hook intro]<br>line<br>` +
        `</div>`,
    );
    const lyrics = await createGeniusProvider({ apiKey: 'test' }).fetchLyrics({ title: 'x' });
    expect(lyrics).not.toBeNull();
    expect(lyrics!.startsWith('[hook intro]')).toBe(true);
  });

  it('recognises [Verse 2: Kendrick Lamar] as a section marker', async () => {
    mockFetch(
      `<div data-lyrics-container="true">` +
        `NOISE HEADER<br>` +
        `[Verse 2: Kendrick Lamar]<br>Real line<br>` +
        `</div>`,
    );
    const lyrics = await createGeniusProvider({ apiKey: 'test' }).fetchLyrics({ title: 'x' });
    expect(lyrics!.startsWith('[Verse 2: Kendrick Lamar]')).toBe(true);
    expect(lyrics).not.toContain('NOISE HEADER');
  });

  it('recognises [Pre-Chorus] and [Guitar Solo] as section markers', async () => {
    mockFetch(
      `<div data-lyrics-container="true">` +
        `junk<br>[Pre-Chorus]<br>a<br>[Guitar Solo]<br></div>`,
    );
    const lyrics = await createGeniusProvider({ apiKey: 'test' }).fetchLyrics({ title: 'x' });
    expect(lyrics!.startsWith('[Pre-Chorus]')).toBe(true);
  });

  it('returns text unchanged when no known section marker and no Read More landmark', async () => {
    mockFetch(
      `<div data-lyrics-container="true">` +
        `Just some<br>plain lyrics<br>no markers<br>` +
        `</div>`,
    );
    const lyrics = await createGeniusProvider({ apiKey: 'test' }).fetchLyrics({ title: 'x' });
    expect(lyrics).toBe('Just some\nplain lyrics\nno markers');
  });
});

describe('genius — error paths', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('search 500 throws RequestError (not KeyError) with redacted url and status', async () => {
    mockSearchNonOk(500);
    let caught: unknown;
    try {
      await createGeniusProvider({ apiKey: 'test' }).fetchLyrics({
        title: 'Test Song',
        artist: 'Test Artist',
      });
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeInstanceOf(RequestError);
    expect(caught).not.toBeInstanceOf(KeyError);
    const err = caught as RequestError;
    expect(err.status).toBe(500);
    expect(err.track).toBe('Test Song');
    expect(err.artist).toBe('Test Artist');
    // URL must be redacted — no query string containing the search terms
    expect(err.url).toBe('https://api.genius.com/search');
    expect(err.url).not.toContain('Test%20Song');
    expect(err.url).not.toContain('Test+Song');
    expect(err.url).not.toContain('?');
  });

  it('search 429 populates retryAfter from delta-seconds', async () => {
    mockSearchNonOk(429, { 'Retry-After': '42' });
    let caught: unknown;
    try {
      await createGeniusProvider({ apiKey: 'test' }).fetchLyrics({ title: 'x' });
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeInstanceOf(RequestError);
    expect((caught as RequestError).status).toBe(429);
    expect((caught as RequestError).retryAfter).toBe(42);
  });

  it('search 429 with HTTP-date parses retryAfter to a non-negative number', async () => {
    const futureDate = new Date(Date.now() + 60_000).toUTCString();
    mockSearchNonOk(429, { 'Retry-After': futureDate });
    let caught: unknown;
    try {
      await createGeniusProvider({ apiKey: 'test' }).fetchLyrics({ title: 'x' });
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeInstanceOf(RequestError);
    const retryAfter = (caught as RequestError).retryAfter;
    expect(typeof retryAfter).toBe('number');
    expect(retryAfter).toBeGreaterThanOrEqual(0);
    expect(retryAfter).toBeLessThanOrEqual(120);
  });

  it('search 429 without Retry-After leaves retryAfter undefined', async () => {
    mockSearchNonOk(429);
    let caught: unknown;
    try {
      await createGeniusProvider({ apiKey: 'test' }).fetchLyrics({ title: 'x' });
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeInstanceOf(RequestError);
    expect((caught as RequestError).retryAfter).toBeUndefined();
  });

  it('page 500 throws RequestError with page url reduced to origin', async () => {
    mockSearchOkPageNonOk(500);
    let caught: unknown;
    try {
      await createGeniusProvider({ apiKey: 'test' }).fetchLyrics({ title: 'x' });
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeInstanceOf(RequestError);
    const err = caught as RequestError;
    expect(err.status).toBe(500);
    // Page URL path carries the title-derived slug, so redact to origin.
    expect(err.url).toBe('https://genius.com');
    expect(err.url).not.toContain('test-song-lyrics');
  });

  it('network failure on search wraps to RequestError with cause and redacted url', async () => {
    const netErr = new Error('ECONNREFUSED');
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw netErr;
      }),
    );
    let caught: unknown;
    try {
      await createGeniusProvider({ apiKey: 'test' }).fetchLyrics({
        title: 'Leaky Title',
        artist: 'Leaky Artist',
      });
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeInstanceOf(RequestError);
    const err = caught as RequestError & { cause?: unknown };
    expect(err.cause).toBe(netErr);
    expect(err.track).toBe('Leaky Title');
    expect(err.artist).toBe('Leaky Artist');
    expect(err.url).toBe('https://api.genius.com/search');
    expect(err.url).not.toContain('Leaky');
  });
});

describe('genius extract — Codex re-review fixes', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('self-closing <div /> inside container does not inflate depth', async () => {
    // If depth-tracking treats <div /> as an opener, the first </div>
    // only lands at depth 1 (instead of 0), and the scanner walks
    // past the intended close — pulling in <div>outside</div>.
    mockFetch(
      `<div data-lyrics-container="true">` +
        `[Intro]<br>Inside line 1<br>` +
        `<div class="ad" />` +
        `Inside line 2<br>` +
        `</div>` +
        `<div class="footer">OUTSIDE CONTENT SHOULD NOT APPEAR</div>`,
    );
    const lyrics = await createGeniusProvider({ apiKey: 'test' }).fetchLyrics({ title: 'x' });
    expect(lyrics).not.toBeNull();
    expect(lyrics).toContain('Inside line 1');
    expect(lyrics).toContain('Inside line 2');
    expect(lyrics).not.toContain('OUTSIDE CONTENT');
  });

  it('<divider> tag inside container does not mis-match as <div', async () => {
    // Word-boundary in the tokenizer regex must rule out <divider>.
    mockFetch(
      `<div data-lyrics-container="true">` +
        `[Intro]<br>Line A<br>` +
        `<divider></divider>` +
        `Line B<br>` +
        `</div>` +
        `<p>OUTSIDE</p>`,
    );
    const lyrics = await createGeniusProvider({ apiKey: 'test' }).fetchLyrics({ title: 'x' });
    expect(lyrics).not.toBeNull();
    expect(lyrics).toContain('Line A');
    expect(lyrics).toContain('Line B');
    expect(lyrics).not.toContain('OUTSIDE');
  });

  it('out-of-range numeric entity &#x110000; preserves literal entity without crashing', async () => {
    mockFetch(
      `<div data-lyrics-container="true">` +
        `[Intro]<br>This is &#x110000; invalid<br>` +
        `</div>`,
    );
    const lyrics = await createGeniusProvider({ apiKey: 'test' }).fetchLyrics({ title: 'x' });
    // Must not throw RangeError; entity text preserved verbatim.
    expect(lyrics).not.toBeNull();
    expect(lyrics).toContain('&#x110000;');
  });

  it('lone surrogate &#xD800; preserves literal entity (not decoded to half-pair)', async () => {
    mockFetch(
      `<div data-lyrics-container="true">` +
        `[Intro]<br>Surrogate &#xD800; here<br>` +
        `</div>`,
    );
    const lyrics = await createGeniusProvider({ apiKey: 'test' }).fetchLyrics({ title: 'x' });
    expect(lyrics).not.toBeNull();
    expect(lyrics).toContain('&#xD800;');
  });

  it('large but valid numeric entity &#x1F600; (😀) decodes correctly', async () => {
    // Positive control: the range validator must not reject legal
    // astral-plane code points.
    mockFetch(
      `<div data-lyrics-container="true">` +
        `[Intro]<br>Emoji &#x1F600; ok<br>` +
        `</div>`,
    );
    const lyrics = await createGeniusProvider({ apiKey: 'test' }).fetchLyrics({ title: 'x' });
    expect(lyrics).toContain('\u{1F600}');
  });
});
