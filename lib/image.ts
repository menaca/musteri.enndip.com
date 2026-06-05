/** next/image optimizer SVG ve bazı CDN'leri desteklemez — doğrudan yükle. */
export function shouldBypassImageOptimizer(src: string): boolean {
  try {
    const u = new URL(src);
    if (u.pathname.toLowerCase().endsWith(".svg")) return true;
    if (u.hostname.includes("simpleicons.org")) return true;
    return false;
  } catch {
    return false;
  }
}
