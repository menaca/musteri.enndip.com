/** Bellek cache süreleri (ms) — sunucu revalidate TTL ile uyumlu. */
export const STALE_TIMES = {
  session: 60_000,
  home: 30_000,
  listings: 60_000,
  profile: 120_000,
  brands: 30 * 60_000,
  series: 30 * 60_000,
} as const;

export const GC_TIME = 10 * 60_000;
