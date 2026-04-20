import { describe, expect, it } from 'vitest';
import { KeyError, createGeniusProvider } from '../src';

const apiKey = process.env.GENIUS_API_KEY?.trim();
const LIVE = Boolean(apiKey);

describe.skipIf(!LIVE)('genius live — GENIUS_API_KEY is set', () => {
  it('fetches lyrics for a well-known song (Bohemian Rhapsody / Queen)', async () => {
    const provider = createGeniusProvider({ apiKey: apiKey! });
    const lyrics = await provider.fetchLyrics({
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
    });
    expect(lyrics, 'expected Genius to return lyrics for a well-known song').not.toBeNull();
    expect(typeof lyrics).toBe('string');
    expect(lyrics!.length).toBeGreaterThan(200);
    expect(lyrics!.toLowerCase()).toContain('mama');
    // Post-filter regressions — stripGeniusMetadata() must remove the
    // page-header block that leaks into data-lyrics-container.
    expect(lyrics).not.toMatch(/^\d+\s*Contributor/);
    expect(lyrics).not.toMatch(/Bohemian Rhapsody Lyrics/);
    expect(lyrics).not.toMatch(/Read More/);
  }, 30_000);

  it('returns null or a string (not throws) for gibberish titles', async () => {
    const provider = createGeniusProvider({ apiKey: apiKey! });
    const result = await provider.fetchLyrics({
      title: 'zzqqxxzz-definitely-not-a-real-song-zzqqxxzz',
    });
    expect(result === null || typeof result === 'string').toBe(true);
  }, 30_000);

  it('rejects a bogus token with KeyError { reason: "rejected", status: 401|403 }', async () => {
    const badProvider = createGeniusProvider({ apiKey: 'invalid-token-lyrics-lib-test-abc123' });
    let caught: unknown;
    try {
      await badProvider.fetchLyrics({ title: 'Bohemian Rhapsody', artist: 'Queen' });
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeInstanceOf(KeyError);
    const err = caught as KeyError;
    expect(err.provider).toBe('genius');
    expect(err.reason).toBe('rejected');
    expect([401, 403]).toContain(err.status);
  }, 30_000);
});

describe.skipIf(LIVE)('genius live — skipped (no GENIUS_API_KEY)', () => {
  it('is skipped; set GENIUS_API_KEY to enable', () => {
    expect(true).toBe(true);
  });
});
