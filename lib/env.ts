/**
 * Tek noktadan ortam değişkeni erişimi + doğrulama.
 *
 * Mimarî: BFF (Backend-for-Frontend). Supabase oturumu httpOnly cookie'de
 * tutulur ve NestJS çağrıları yalnızca sunucu tarafında yapılır. Bu yüzden
 * API_BASE_URL gibi değişkenler `NEXT_PUBLIC_` ile başlamaz (tarayıcıya sızmaz).
 *
 * - NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY: tarayıcı auth (PKCE) için.
 * - API_BASE_URL: NestJS core API (örn. https://...railway.app/api/v1) — server-only.
 * - API_PUBLIC_BASE_URL: vehicle-imagery proxy'nin ürettiği mutlak URL tabanı.
 * - SITE_URL: OAuth redirect ve metadata taban URL'i.
 */

function required(name: string, value: string | undefined): string {
  if (!value || value.trim() === "") {
    // Build/SSR sırasında erken patlamak yerine net hata mesajı verilir.
    throw new Error(
      `[env] Zorunlu ortam değişkeni eksik: ${name}. Vercel → Project Settings → Environment Variables kontrol edin.`,
    );
  }
  return value.trim();
}

function optional(value: string | undefined, fallback = ""): string {
  return (value ?? fallback).trim();
}

/** Tarayıcı + sunucuda erişilebilir (NEXT_PUBLIC). */
export const publicEnv = {
  supabaseUrl: optional(process.env.NEXT_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: optional(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  siteUrl: optional(process.env.NEXT_PUBLIC_SITE_URL, "https://musteri.enndip.com"),
} as const;

/** Yalnızca sunucu (RSC, route handler, server action) erişebilir. */
export const serverEnv = {
  get supabaseUrl() {
    return required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
  },
  get supabaseAnonKey() {
    return required(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
  },
  /** NestJS core API tabanı, /api/v1 dahil. */
  get apiBaseUrl() {
    return required("API_BASE_URL", process.env.API_BASE_URL).replace(/\/+$/, "");
  },
  /** Imagery proxy mutlak URL'leri için; yoksa apiBaseUrl host'u kullanılır. */
  get apiPublicBaseUrl() {
    return optional(process.env.API_PUBLIC_BASE_URL);
  },
} as const;

export function assertPublicEnv(): void {
  required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
  required("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
