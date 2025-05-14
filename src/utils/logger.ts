export const logger = {
  info: (...args: any[]) => {
    console.info('[lyrics-lib][INFO]', ...args);
  },
  warn: (...args: any[]) => {
    console.warn('[lyrics-lib][WARN]', ...args);
  },
  error: (...args: any[]) => {
    console.error('[lyrics-lib][ERROR]', ...args);
  },
}; 