import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { GUEST_COOKIE } from "@/lib/auth/guest";
import { Routes } from "@/lib/routes";

/**
 * OAuth (Google/Apple) ve e-posta bağlantısı dönüş noktası.
 * PKCE: ?code=... → exchangeCodeForSession → httpOnly cookie. Sonra ?next'e gider.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = sanitizeNext(url.searchParams.get("next"));
  const errorDescription = url.searchParams.get("error_description");

  if (errorDescription) {
    return redirectToError(request, errorDescription);
  }

  if (!code) {
    return redirectToError(request, "Doğrulama kodu bulunamadı.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return redirectToError(request, error.message);
  }

  // Oturum açıldı — guest işaretini temizle.
  const store = await cookies();
  store.delete(GUEST_COOKIE);

  return NextResponse.redirect(new URL(next, request.url));
}

function sanitizeNext(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return Routes.home;
  }
  return next;
}

function redirectToError(request: NextRequest, message: string) {
  const target = new URL(Routes.authLinkError, request.url);
  target.searchParams.set("message", message);
  return NextResponse.redirect(target);
}
