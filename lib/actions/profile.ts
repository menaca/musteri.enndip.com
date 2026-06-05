"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/server";
import { Endpoints } from "@/lib/api/endpoints";
import { Routes } from "@/lib/routes";
import type { UpdateProfileDto, UserProfileDto } from "@/lib/api/types";

export type ProfileResult =
  | { ok: true; profile: UserProfileDto }
  | { ok: false; message: string };

/** Profili güncelle — PATCH /users/me. */
export async function updateProfileAction(input: UpdateProfileDto): Promise<ProfileResult> {
  const body: UpdateProfileDto = {};
  if (input.fullName !== undefined) body.fullName = input.fullName.trim();
  if (input.phone !== undefined) body.phone = input.phone.trim();
  if (input.avatarUrl !== undefined) body.avatarUrl = input.avatarUrl;

  try {
    const profile = await apiFetch<UserProfileDto>(Endpoints.me, {
      method: "PATCH",
      body,
      auth: "required",
      cache: "no-store",
    });
    revalidatePath(Routes.account);
    return { ok: true, profile };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Profil güncellenemedi.",
    };
  }
}
