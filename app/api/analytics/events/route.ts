import { NextResponse, type NextRequest } from "next/server";
import { apiFetch } from "@/lib/api/server";
import { Endpoints } from "@/lib/api/endpoints";

interface EventInput {
  sessionId?: string;
  eventName: string;
  screenName?: string;
  durationMs?: number;
  properties?: Record<string, unknown>;
}

/** Web event batch — NestJS analytics/events'e (optional auth) proxy. */
export async function POST(request: NextRequest) {
  let events: EventInput[] = [];
  try {
    const body = (await request.json()) as { events?: EventInput[] };
    events = Array.isArray(body.events) ? body.events.slice(0, 50) : [];
  } catch {
    events = [];
  }
  if (events.length === 0) {
    return NextResponse.json({ ok: true });
  }

  try {
    await apiFetch(Endpoints.analyticsEvents, {
      method: "POST",
      auth: "optional",
      cache: "no-store",
      body: { app: "enndip", events },
    });
  } catch {
    // yoksay — analitik kullanıcıyı etkilemez
  }
  return NextResponse.json({ ok: true });
}
