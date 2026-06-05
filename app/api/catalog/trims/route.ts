import { NextResponse, type NextRequest } from "next/server";
import { getTrims } from "@/lib/api/queries";
import { ApiError } from "@/lib/api/server";

export async function GET(request: NextRequest) {
  const seriesId = request.nextUrl.searchParams.get("seriesId");
  const category = request.nextUrl.searchParams.get("category") || undefined;
  if (!seriesId) {
    return NextResponse.json({ message: "seriesId gerekli." }, { status: 400 });
  }
  try {
    const data = await getTrims(seriesId, category);
    return NextResponse.json(data);
  } catch (e) {
    const status = e instanceof ApiError ? e.status || 502 : 502;
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Paketler alınamadı." },
      { status },
    );
  }
}
