import { NextResponse } from "next/server";
import { getHomeFeed } from "@/lib/api/queries";
import { ApiError } from "@/lib/api/server";

export async function GET() {
  try {
    const feed = await getHomeFeed();
    return NextResponse.json(feed);
  } catch (e) {
    const status = e instanceof ApiError ? e.status || 502 : 502;
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Ana sayfa yüklenemedi." },
      { status },
    );
  }
}
