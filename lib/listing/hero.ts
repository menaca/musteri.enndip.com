import "server-only";

import { getModelBundle } from "@/lib/api/queries";
import { buildListingHeroFromBundle } from "./hero-client";

export interface ListingColorChoice {
  id: string;
  name: string;
  hex: string;
}

export interface ListingHero {
  modelName: string;
  modelWebsiteUrl: string | null;
  imageUrl: string | null;
  selectedColors: ListingColorChoice[];
}

/**
 * summary/offer ekranları için araç başlık görseli + model adı + seçili renkler.
 * Seçili renk varsa o renge ait IMAGIN görseli kullanılır.
 */
/** Sunucu tarafı fallback — galeri beklemez; bundle preview kullanır. */
export async function resolveListingHero(
  modelId: string,
  colorIds: string[],
): Promise<ListingHero> {
  const bundle = await getModelBundle(modelId).catch(() => null);
  if (!bundle) {
    return {
      modelName: "",
      modelWebsiteUrl: null,
      imageUrl: null,
      selectedColors: [],
    };
  }
  return buildListingHeroFromBundle(bundle, colorIds);
}
