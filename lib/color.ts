/** API'den gelen hex değerini (# ile veya # olmadan) normalize eder. */
export function normalizeHexCode(raw?: string | null, fallback = "cccccc"): string {
  if (!raw?.trim()) return fallback;
  return raw.trim().replace(/^#/, "");
}

const HEX6 = /^[0-9A-Fa-f]{6}$/;
const HEX3 = /^[0-9A-Fa-f]{3}$/;

/** UI / CSS backgroundColor için geçerli #RRGGBB. Geçersiz değerde fallback. */
export function toDisplayHex(raw?: string | null, fallback = "#cccccc"): string {
  const fb = fallback.startsWith("#") ? fallback : `#${fallback}`;
  const n = normalizeHexCode(raw, fb.replace(/^#/, ""));
  if (HEX6.test(n)) return `#${n}`;
  if (HEX3.test(n)) {
    return `#${n[0]}${n[0]}${n[1]}${n[1]}${n[2]}${n[2]}`;
  }
  return fb;
}
