import { NextResponse } from "next/server";
import { getServerAuth } from "@/lib/supabase/server";
import { isGuest } from "@/lib/auth/guest";

/** Hafif oturum özeti — prefetch ve nav için (token sızdırmaz). */
export async function GET() {
  const [{ user }, guest] = await Promise.all([getServerAuth(), isGuest()]);
  return NextResponse.json({
    isAuthed: Boolean(user),
    isGuest: guest,
  });
}
