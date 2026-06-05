const RENDER_PATH = /vehicle-imagery\/render/i;

/**
 * NestJS vehicle-imagery/render URL'lerini tarayıcıya same-origin BFF proxy'ye çevirir.
 * Railway doğrudan yüklemede CORP (NotSameOrigin) hatası verir; localhost + prod için
 * `/api/imagery/render?token=…` kullanılır.
 */
export function toPublicImageryUrl(url: string): string {
  if (!url?.trim()) return url;
  if (!RENDER_PATH.test(url)) return url;

  try {
    const parsed = /^https?:\/\//i.test(url)
      ? new URL(url)
      : new URL(url, "https://placeholder.local");
    const token = parsed.searchParams.get("token");
    if (token) return `/api/imagery/render?token=${encodeURIComponent(token)}`;
  } catch {
    // regex fallback
  }

  const tokenMatch = url.match(/[?&]token=([^&]+)/);
  if (tokenMatch?.[1]) {
    return `/api/imagery/render?token=${tokenMatch[1]}`;
  }

  return url;
}

export function mapPublicImageryUrls(urls: string[] | undefined): string[] {
  return (urls ?? []).map(toPublicImageryUrl);
}
