import { NextResponse, type NextRequest } from "next/server";
import { getEngines } from "@/lib/api/queries";
import { ApiError } from "@/lib/api/server";

export async function GET(request: NextRequest) {
  const seriesId = request.nextUrl.searchParams.get("seriesId");
  const trimId = request.nextUrl.searchParams.get("trimId");
  const category = request.nextUrl.searchParams.get("category") || undefined;
  if (!seriesId || !trimId) {
    return NextResponse.json(
      { message: "seriesId ve trimId gerekli." },
      { status: 400 },
    );
  }
  try {
    const data = await getEngines(seriesId, trimId, category);
    return NextResponse.json(data);
  } catch (e) {
    const status = e instanceof ApiError ? e.status || 502 : 502;
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Motorlar alınamadı." },
      { status },
    );
  }
}
