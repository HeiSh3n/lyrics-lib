import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  KeyError,
  LyricsLibError,
  NotImplementedError,
  createGeniusProvider,
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

describe('createGeniusProvider', () => {
  it('throws KeyError when apiKey is empty or whitespace', () => {
    expect(() => createGeniusProvider({ apiKey: '' })).toThrow(KeyError);
    expect(() => createGeniusProvider({ apiKey: '   ' })).toThrow(KeyError);
  });

  it('returns a provider named "genius" when apiKey is supplied', () => {
    const p = createGeniusProvider({ apiKey: 'test-token' });
    expect(p.name).toBe('genius');
    expect(typeof p.fetchLyrics).toBe('function');
  });

  it('KeyError from missing apiKey is a LyricsLibError and carries provider+reason', () => {
    try {
      createGeniusProvider({ apiKey: '' });
    } catch (e) {
      expect(e).toBeInstanceOf(LyricsLibError);
      expect((e as KeyError).provider).toBe('genius');
      expect((e as KeyError).reason).toBe('missing');
      expect((e as KeyError).status).toBeUndefined();
    }
  });
});

describe('default geniusProvider (env-backed)', () => {
  beforeEach(() => {
    vi.stubEnv('GENIUS_API_KEY', '');
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('throws KeyError with reason="missing" when GENIUS_API_KEY is unset', async () => {
    await expect(geniusProvider.fetchLyrics({ title: 'x' })).rejects.toBeInstanceOf(KeyError);
    try {
      await geniusProvider.fetchLyrics({ title: 'x' });
    } catch (e) {
      expect(e).toBeInstanceOf(LyricsLibError);
      expect((e as KeyError).provider).toBe('genius');
      expect((e as KeyError).reason).toBe('missing');
    }
  });
});

describe('placeholder providers', () => {
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
