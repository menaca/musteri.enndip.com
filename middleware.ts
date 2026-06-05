import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { GUEST_COOKIE } from "@/lib/auth/guest";
import { AUTH_REQUIRED_PATHS, AUTH_PUBLIC_PATHS, Routes } from "@/lib/routes";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Oturumu her istekte tazele (token refresh) — Supabase SSR gereği.
  const { response, user } = await updateSession(request);

  const isGuest = request.cookies.get(GUEST_COOKIE)?.value === "1";
  const isAuthed = !!user;

  // 1) Oturum gerektiren rotalar — anon ve guest engellenir.
  if (AUTH_REQUIRED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    if (!isAuthed) {
      const url = new URL(Routes.login, request.url);
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }
  }

  // 2) Public auth rotaları — oturumluyken home'a at.
  if (isAuthed && AUTH_PUBLIC_PATHS.some((p) => pathname === p)) {
    return NextResponse.redirect(new URL(Routes.home, request.url));
  }

  // 3) İlk açılış: kök ziyaret + ne oturum ne guest → login (sol panelde onboarding).
  if (pathname === Routes.home && !isAuthed && !isGuest) {
    return NextResponse.redirect(new URL(Routes.login, request.url));
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
