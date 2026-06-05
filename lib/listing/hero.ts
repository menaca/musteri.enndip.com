import "server-only";

import {
  getModelDetail,
  getModelColors,
  getImageryGallery,
} from "@/lib/api/queries";

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
export async function resolveListingHero(
  modelId: string,
  colorIds: string[],
): Promise<ListingHero> {
  const [detail, colors] = await Promise.all([
    getModelDetail(modelId).catch(() => null),
    getModelColors(modelId).catch(() => []),
  ]);

  const selected = colorIds.length
    ? colors.filter((c) => colorIds.includes(c.id))
    : [];
  const primary = selected[0] ?? colors[0] ?? null;

  let imageUrl = detail?.previewImageUrl ?? null;
  if (primary) {
    try {
      const gallery = await getImageryGallery(
        modelId,
        primary.imaginPaintId ?? undefined,
        primary.imaginPaintDescription ?? undefined,
      );
      if (gallery.slides[0]?.url) imageUrl = gallery.slides[0].url;
    } catch {
      // fallback: model preview
    }
  }

  return {
    modelName: detail?.name ?? "",
    modelWebsiteUrl: detail?.websiteUrl ?? null,
    imageUrl,
    selectedColors: selected.map((c) => ({
      id: c.id,
      name: c.name,
      hex: c.hexCode,
    })),
  };
}
