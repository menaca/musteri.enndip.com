import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { VehicleOptions } from "@/components/listing/vehicle-options";
import {
  getModelDetail,
  getModelPanelSpec,
  getModelColors,
  getImageryGallery,
} from "@/lib/api/queries";
import { parseSelection } from "@/lib/listing/selection";
import { normalizeHexCode } from "@/lib/color";
import { Routes } from "@/lib/routes";
import type { CarModelColorDto } from "@/lib/api/types";

export const metadata: Metadata = { title: "Araç Seçenekleri" };

export default async function VehicleOptionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const selection = parseSelection(sp);
  if (!selection) redirect(Routes.findCar);

  const { modelId } = selection;

  const [detail, panelSpec, colorsRaw] = await Promise.all([
    getModelDetail(modelId).catch(() => null),
    getModelPanelSpec(modelId).catch(() => null),
    getModelColors(modelId).catch(() => [] as CarModelColorDto[]),
  ]);

  // Renk yoksa panel-spec renk skalasından türet (mobil davranışı).
  // Backend colorScaleItems: { name, hex } — hexCode değil.
  let colors: CarModelColorDto[] = colorsRaw.filter((c) => c.name && c.hexCode);
  if (colors.length === 0 && panelSpec?.colorScaleItems?.length) {
    colors = panelSpec.colorScaleItems
      .filter((c) => c.name && c.hex)
      .map((c) => {
        const hex = normalizeHexCode(c.hex);
        return {
          id: `panel:${c.name}:${hex}`,
          modelId,
          name: c.name,
          hexCode: hex,
          imaginPaintId: null,
          imaginPaintDescription: null,
        };
      });
  }

  const firstColor = colors[0];
  let initialImages: string[] = [];
  try {
    const gallery = await getImageryGallery(
      modelId,
      firstColor?.imaginPaintId ?? undefined,
      firstColor?.imaginPaintDescription ?? undefined,
    );
    initialImages = gallery.slides.map((s) => s.url);
  } catch {
    initialImages = detail?.previewImageUrls ?? [];
  }
  if (initialImages.length === 0 && detail?.previewImageUrls?.length) {
    initialImages = detail.previewImageUrls;
  }

  return (
    <div className="px-5 py-6 sm:px-6 lg:px-10 lg:py-10">
      <VehicleOptions
        selection={selection}
        modelName={detail?.name ?? selection.brandName}
        modelWebsiteUrl={detail?.websiteUrl ?? null}
        colors={colors}
        panelSpec={panelSpec}
        initialImages={initialImages}
      />
    </div>
  );
}
