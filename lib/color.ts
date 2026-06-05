/** API'den gelen hex değerini (# ile veya # olmadan) normalize eder. */
export function normalizeHexCode(raw?: string | null, fallback = "cccccc"): string {
  if (!raw?.trim()) return fallback;
  return raw.trim().replace(/^#/, "");
}

/** UI'da kullanım için # önekli hex. */
export function toDisplayHex(raw?: string | null, fallback = "#cccccc"): string {
  const n = normalizeHexCode(raw, fallback.replace(/^#/, ""));
  return n.startsWith("#") ? n : `#${n}`;
}
