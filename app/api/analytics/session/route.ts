import { NextResponse, type NextRequest } from "next/server";
import { apiFetch } from "@/lib/api/server";
import { Endpoints } from "@/lib/api/endpoints";

interface StartBody {
  appVersion?: string;
  osVersion?: string;
  locale?: string;
  timezone?: string;
  deviceType?: "phone" | "tablet";
}

/** Web oturum başlat — NestJS analytics/session/start'a (optional auth) proxy. */
export async function POST(request: NextRequest) {
  let body: StartBody = {};
  try {
    body = (await request.json()) as StartBody;
  } catch {
    body = {};
  }

  try {
    const res = await apiFetch<{ sessionId: string; isNewUser: boolean }>(
      Endpoints.analyticsSessionStart,
      {
        method: "POST",
        auth: "optional",
        cache: "no-store",
        body: {
          app: "enndip",
          platform: "web",
          appVersion: body.appVersion,
          osVersion: body.osVersion,
          locale: body.locale ?? "tr",
          timezone: body.timezone ?? "Europe/Istanbul",
          ...(body.deviceType ? { deviceType: body.deviceType } : {}),
        },
      },
    );
    return NextResponse.json(res);
  } catch {
    // Analitik asla kullanıcıyı etkilemez.
    return NextResponse.json({ sessionId: null }, { status: 200 });
  }
}
