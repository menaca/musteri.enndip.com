import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { GUEST_COOKIE } from "@/lib/auth/guest";
import { AUTH_REQUIRED_PATHS, AUTH_PUBLIC_PATHS, Routes } from "@/lib/routes";

const SITE_ORIGIN =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://musteri.enndip.com").replace(/\/+$/, "");

function appUrl(path: string, search?: Record<string, string>) {
  const url = new URL(path, SITE_ORIGIN);
  if (search) {
    for (const [k, v] of Object.entries(search)) url.searchParams.set(k, v);
  }
  return url;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Oturumu her istekte tazele (token refresh) — Supabase SSR gereği.
  const { response, user } = await updateSession(request);

  const isGuest = request.cookies.get(GUEST_COOKIE)?.value === "1";
  const isAuthed = !!user;

  // 1) Oturum gerektiren rotalar — anon ve guest engellenir.
  if (AUTH_REQUIRED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    if (!isAuthed) {
      return NextResponse.redirect(appUrl(Routes.login, { redirectTo: pathname }));
    }
  }

  // 2) Public auth rotaları — oturumluyken home'a at.
  if (isAuthed && AUTH_PUBLIC_PATHS.some((p) => pathname === p)) {
    return NextResponse.redirect(appUrl(Routes.home));
  }

  // 3) İlk açılış: kök ziyaret + ne oturum ne guest → login (sol panelde onboarding).
  if (pathname === Routes.home && !isAuthed && !isGuest) {
    return NextResponse.redirect(appUrl(Routes.login));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * _next/static, _next/image, favicon, manifest, ikon, robots, sitemap ve
     * auth/callback hariç tüm rotalar.
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|icon|apple-icon|robots.txt|sitemap.xml|auth/callback).*)",
  ],
};
