import { normalizeHexCode } from "@/lib/color";
import type { CarModelColorDto, CarModelPanelSpecDto } from "@/lib/api/types";

/** Panel-spec renk skalası — tek kaynak (car_model_colors kullanılmaz). */
export function colorsFromPanelSpec(
  modelId: string,
  panelSpec: CarModelPanelSpecDto | null,
): CarModelColorDto[] {
  if (!panelSpec?.colorScaleItems?.length) return [];

  return panelSpec.colorScaleItems
    .filter((c) => c.name && c.hex)
    .map((c) => {
      const hex = normalizeHexCode(c.hex).replace(/^#/, "");
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

/** @deprecated colorsFromPanelSpec kullanın */
export const resolveListingColors = colorsFromPanelSpec;
