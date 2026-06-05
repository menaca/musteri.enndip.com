"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api/server";
import { Endpoints } from "@/lib/api/endpoints";
import { getCurrentUser } from "@/lib/supabase/server";
import { Routes } from "@/lib/routes";
import type { CreateListingDto, ListingDto } from "@/lib/api/types";

export interface PublishInput {
  brandId: string;
  modelId: string;
  engineId: string;
  colorIds?: string[];
  durationHours?: number;
}

export type ActionResult =
  | { ok: true }
  | { ok: false; message: string; needAuth?: boolean };

/** İlan yayınla — POST /listings. Auth zorunlu (guest → needAuth). */
export async function publishListingAction(input: PublishInput): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, needAuth: true, message: "İlan vermek için giriş yapmalısınız." };
  }

  const colorIds = (input.colorIds ?? []).filter((id) => id && !id.startsWith("panel:"));
  const body: CreateListingDto = {
    brandId: input.brandId,
    modelId: input.modelId,
    engineId: input.engineId,
    ...(colorIds.length ? { colorIds } : {}),
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
