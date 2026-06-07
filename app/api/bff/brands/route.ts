import { NextResponse, type NextRequest } from "next/server";
import { getBrands } from "@/lib/api/queries";
import { ApiError } from "@/lib/api/server";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category") || undefined;
  try {
    const brands = await getBrands(category);
    return NextResponse.json(brands);
  } catch (e) {
    const status = e instanceof ApiError ? e.status || 502 : 502;
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Markalar yüklenemedi." },
      { status },
    );
  }
}
