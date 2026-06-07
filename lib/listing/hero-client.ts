import type { CarModelBundleDto } from "@/lib/api/types";
import { resolveListingColors } from "./bundle-colors";
import type { ListingHero } from "./hero";

/** Bundle + seçim → summary/offer vitrin verisi (galeri beklemez). */
export function buildListingHeroFromBundle(
  bundle: CarModelBundleDto,
  colorIds: string[],
): ListingHero {
  const colors = resolveListingColors(
    bundle.detail.id,
    bundle.colors,
    bundle.panelSpec,
  );
  const selected = colorIds.length
    ? colors.filter((c) => colorIds.includes(c.id))
    : [];

  return {
    modelName: bundle.detail.name,
    modelWebsiteUrl: bundle.detail.websiteUrl ?? null,
    imageUrl: bundle.detail.previewImageUrl ?? null,
    selectedColors: selected.map((c) => ({
      id: c.id,
      name: c.name,
      hex: c.hexCode,
    })),
  };
}
