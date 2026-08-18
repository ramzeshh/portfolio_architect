const base = import.meta.env.BASE_URL.replace(/\/$/, '');
/** Prefix an absolute site path with the configured base ('' or '/repo'). */
export const withBase = (path: string) => `${base}${path}`;
