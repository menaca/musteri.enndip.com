import { normalizeHexCode } from "@/lib/color";
import type { CarModelColorDto, CarModelPanelSpecDto } from "@/lib/api/types";

/** DB renkleri yoksa panel-spec renk skalasından türet (mobil davranışı). */
export function resolveListingColors(
  modelId: string,
  colorsRaw: CarModelColorDto[],
  panelSpec: CarModelPanelSpecDto | null,
): CarModelColorDto[] {
  const fromDb = colorsRaw.filter((c) => c.name && c.hexCode);
  if (fromDb.length > 0) return fromDb;

  if (!panelSpec?.colorScaleItems?.length) return [];

  return panelSpec.colorScaleItems
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
