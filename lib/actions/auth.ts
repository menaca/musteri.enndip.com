"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { GUEST_COOKIE } from "@/lib/auth/guest";
import { Routes } from "@/lib/routes";

/** Çıkış yap — oturumu kapat, guest işaretini temizle, login'e dön. */
export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  const store = await cookies();
  store.delete(GUEST_COOKIE);
  redirect(Routes.login);
}

/** Misafir olarak devam et — guest cookie set et, home'a git. */
export async function continueAsGuestAction() {
  const store = await cookies();
  store.set(GUEST_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect(Routes.home);
}
