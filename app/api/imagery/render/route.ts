import { NextResponse, type NextRequest } from "next/server";
import { serverEnv } from "@/lib/env";

/** IMAGIN render proxy — Railway'den sunucu tarafında çekip same-origin servis eder. */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token || token.length > 2048) {
    return new NextResponse(null, { status: 400 });
  }

  const upstream = `${serverEnv.apiBaseUrl}/vehicle-imagery/render?token=${encodeURIComponent(token)}`;

  let res: Response;
  try {
    res = await fetch(upstream, { next: { revalidate: 86400 } });
  } catch {
    return new NextResponse(null, { status: 502 });
  }

  if (!res.ok) {
    return new NextResponse(null, { status: res.status });
  }

  const contentType = res.headers.get("content-type") ?? "image/jpeg";
  const body = await res.arrayBuffer();

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
