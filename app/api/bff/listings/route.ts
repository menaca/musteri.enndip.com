import { NextResponse } from "next/server";
import { getMyListings } from "@/lib/api/queries";
import { ApiError } from "@/lib/api/server";

export async function GET() {
  try {
    const listings = await getMyListings();
    return NextResponse.json(listings);
  } catch (e) {
    const status = e instanceof ApiError ? e.status || 502 : 502;
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "İlanlar yüklenemedi." },
      { status },
    );
  }
}
