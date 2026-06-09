"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api/server";
import { Endpoints } from "@/lib/api/endpoints";
import { getCurrentUser } from "@/lib/supabase/server";
import { Routes } from "@/lib/routes";
import type { CreateListingDto, ListingDto } from "@/lib/api/types";

export interface ListingColorPreference {
  name: string;
  hexCode: string;
}

export interface PublishInput {
  brandId: string;
  modelId: string;
  engineId: string;
  /** URL state — panel:{ad}:{hex} sentetik id'leri */
  colorIds?: string[];
  colorPreferences?: ListingColorPreference[];
  durationHours?: number;
}

export type ActionResult =
  | { ok: true }
  | { ok: false; message: string; needAuth?: boolean };

function panelIdToPreference(id: string): ListingColorPreference | null {
  if (!id.startsWith("panel:")) return null;
  const parts = id.split(":");
  if (parts.length < 3) return null;
  return { name: parts[1], hexCode: parts.slice(2).join(":") };
}

function buildColorPreferences(input: PublishInput): ListingColorPreference[] {
  const prefs: ListingColorPreference[] = [];
  const seen = new Set<string>();

  for (const id of input.colorIds ?? []) {
    const pref = panelIdToPreference(id);
    if (!pref) continue;
    const key = `${pref.name}\0${pref.hexCode}`;
    if (seen.has(key)) continue;
    seen.add(key);
    prefs.push(pref);
  }

  for (const pref of input.colorPreferences ?? []) {
    if (!pref.name || !pref.hexCode) continue;
    const key = `${pref.name}\0${pref.hexCode}`;
    if (seen.has(key)) continue;
    seen.add(key);
    prefs.push(pref);
  }

  return prefs;
}

/** İlan yayınla — POST /listings. Auth zorunlu (guest → needAuth). */
export async function publishListingAction(input: PublishInput): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, needAuth: true, message: "İlan vermek için giriş yapmalısınız." };
  }

  const colorPreferences = buildColorPreferences(input);
  const body: CreateListingDto = {
    brandId: input.brandId,
    modelId: input.modelId,
    engineId: input.engineId,
    ...(colorPreferences.length ? { colorPreferences } : {}),
    durationHours: input.durationHours ?? 168,
  };

  try {
    await apiFetch<ListingDto>(Endpoints.listings, {
      method: "POST",
      body,
      auth: "required",
      cache: "no-store",
    });
    revalidatePath(Routes.myListings);
    revalidatePath(Routes.home);
    return { ok: true };
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      return { ok: false, needAuth: true, message: "Oturum süresi doldu. Tekrar giriş yap." };
    }
    return {
      ok: false,
      message: e instanceof Error ? e.message : "İlan oluşturulamadı.",
    };
  }
}

/** İlan iptal — DELETE /listings/:id. */
export async function cancelListingAction(listingId: string): Promise<ActionResult> {
  try {
    await apiFetch<{ id: string; status: string }>(Endpoints.listing(listingId), {
      method: "DELETE",
      auth: "required",
      cache: "no-store",
    });
    revalidatePath(Routes.myListings);
    revalidatePath(Routes.home);
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "İlan iptal edilemedi.",
    };
  }
}
