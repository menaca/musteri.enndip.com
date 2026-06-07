import { NextResponse } from "next/server";
import { getMyProfile } from "@/lib/api/queries";
import { ApiError } from "@/lib/api/server";

export async function GET() {
  try {
    const profile = await getMyProfile();
    return NextResponse.json(profile);
  } catch (e) {
    const status = e instanceof ApiError ? e.status || 502 : 502;
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Profil yüklenemedi." },
      { status },
    );
  }
}
