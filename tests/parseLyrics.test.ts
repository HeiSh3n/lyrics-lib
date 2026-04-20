import { describe, expect, it } from 'vitest';
import {
  LyricsLibError,
  NotFoundError,
  RequestError,
  getLyrics,
  parseLyrics,
} from '../src';

describe('parseLyrics', () => {
  it('returns null synced when input has no timestamps', () => {
    const result = parseLyrics('first line\nsecond line');
    expect(result.synced).toBeNull();
    expect(result.unsynced).toEqual([{ text: 'first line' }, { text: 'second line' }]);
  });

  it('extracts synced lines with millisecond startTime', () => {
    const result = parseLyrics('[00:01.50]first\n[00:03.00]second');
    expect(result.synced).toEqual([
      { text: 'first', startTime: 1500 },
      { text: 'second', startTime: 3000 },
    ]);
    expect(result.unsynced).toEqual([]);
  });

  it('separates synced and unsynced lines from a mixed input', () => {
    const result = parseLyrics('[00:00.00]intro\nplain note\n[00:02.10]verse');
    expect(result.synced).toHaveLength(2);
    expect(result.unsynced).toEqual([{ text: 'plain note' }]);
  });

  it('strips metadata tags like [artist:Name]', () => {
    const result = parseLyrics('[artist:Foo]\n[00:01.00]hello');
    expect(result.synced).toEqual([{ text: 'hello', startTime: 1000 }]);
    expect(result.unsynced).toEqual([]);
  });

  it('drops empty timestamp-only lines', () => {
    const result = parseLyrics('[00:01.00]\n[00:02.00]real line');
    expect(result.synced).toEqual([{ text: 'real line', startTime: 2000 }]);
  });
});

describe('getLyrics validation', () => {
  it('throws LyricsLibError when title is empty', async () => {
    await expect(getLyrics({ title: '' })).rejects.toBeInstanceOf(LyricsLibError);
    await expect(getLyrics({ title: '' })).rejects.toThrow('Title is required');
  });
});

describe('error class hierarchy', () => {
  it('RequestError extends LyricsLibError extends Error', () => {
    const err = new RequestError('boom', { status: 503, url: 'https://x', track: 't' });
    expect(err).toBeInstanceOf(RequestError);
    expect(err).toBeInstanceOf(LyricsLibError);
    expect(err).toBeInstanceOf(Error);
    expect(err.status).toBe(503);
    expect(err.url).toBe('https://x');
    expect(err.track).toBe('t');
    expect(err.name).toBe('RequestError');
  });

  it('RequestError supports zero-arg construction (v1.x compat)', () => {
    const err = new RequestError();
    expect(err.message).toBe('Request error');
    expect(err.status).toBeUndefined();
  });

  it('NotFoundError extends LyricsLibError', () => {
    const err = new NotFoundError();
    expect(err).toBeInstanceOf(LyricsLibError);
    expect(err.name).toBe('NotFoundError');
  });
});
