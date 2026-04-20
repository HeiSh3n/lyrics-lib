import { describe, expect, it } from 'vitest';
import {
  LyricsLibError,
  NotImplementedError,
  geniusProvider,
  lrclibProvider,
  musixmatchProvider,
  providers,
} from '../src';

describe('provider registry', () => {
  it('exposes lrclib, genius, musixmatch keyed by name', () => {
    expect(Object.keys(providers).sort()).toEqual(['genius', 'lrclib', 'musixmatch']);
    expect(providers.lrclib).toBe(lrclibProvider);
    expect(providers.genius).toBe(geniusProvider);
    expect(providers.musixmatch).toBe(musixmatchProvider);
  });

  it('every provider has a stable name matching its registry key', () => {
    for (const [key, provider] of Object.entries(providers)) {
      expect(provider.name).toBe(key);
    }
  });

  it('registry is frozen against mutation', () => {
    expect(Object.isFrozen(providers)).toBe(true);
  });
});

describe('placeholder providers', () => {
  it('genius.fetchLyrics throws NotImplementedError carrying provider+feature', async () => {
    await expect(geniusProvider.fetchLyrics({ title: 'x' })).rejects.toBeInstanceOf(
      NotImplementedError,
    );
    try {
      await geniusProvider.fetchLyrics({ title: 'x' });
    } catch (e) {
      expect(e).toBeInstanceOf(LyricsLibError);
      expect((e as NotImplementedError).provider).toBe('genius');
      expect((e as NotImplementedError).feature).toBe('fetchLyrics');
    }
  });

  it('musixmatch.fetchLyrics throws NotImplementedError carrying provider+feature', async () => {
    await expect(musixmatchProvider.fetchLyrics({ title: 'x' })).rejects.toBeInstanceOf(
      NotImplementedError,
    );
    try {
      await musixmatchProvider.fetchLyrics({ title: 'x' });
    } catch (e) {
      expect(e).toBeInstanceOf(LyricsLibError);
      expect((e as NotImplementedError).provider).toBe('musixmatch');
    }
  });
});
