import { publicEnv } from "@/lib/env";

const DEFAULT_ORIGIN = "https://musteri.enndip.com";

/** OAuth / e-posta redirect tabanı. Önce NEXT_PUBLIC_SITE_URL, yoksa tarayıcı origin. */
export function siteOrigin(): string {
  const configured = publicEnv.siteUrl.replace(/\/+$/, "");
  if (configured) return configured;
  if (typeof window !== "undefined") return window.location.origin;
  return DEFAULT_ORIGIN;
}

/** Supabase auth callback URL'i (`/auth/callback`). */
export function authCallbackUrl(next?: string): string {
  const base = `${siteOrigin()}/auth/callback`;
  if (!next) return base;
  const q = `next=${encodeURIComponent(next)}`;
  return base.includes("?") ? `${base}&${q}` : `${base}?${q}`;
}
