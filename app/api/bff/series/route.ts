import { NextResponse, type NextRequest } from "next/server";
import { getSeries } from "@/lib/api/queries";
import { ApiError } from "@/lib/api/server";

export async function GET(request: NextRequest) {
  const brandId = request.nextUrl.searchParams.get("brandId");
  const category = request.nextUrl.searchParams.get("category") || undefined;
  if (!brandId) {
    return NextResponse.json({ message: "brandId gerekli." }, { status: 400 });
  }
  try {
    const series = await getSeries(brandId, category);
    return NextResponse.json(series);
  } catch (e) {
    const status = e instanceof ApiError ? e.status || 502 : 502;
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Seriler yüklenemedi." },
      { status },
    );
  }
}
