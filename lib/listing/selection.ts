/**
 * Seçilen araç, listing akışı boyunca (vehicle-options → summary → offer)
 * URL query'sinde taşınır. Bu sayede refresh/paylaşım dayanıklıdır ve
 * sayfalar server-side render edilebilir. Flutter SelectedVehicle karşılığı.
 */
export interface VehicleSelection {
  brandId: string;
  brandName: string;
  modelId: string;
  engineId: string;
  engineName: string;
  trimName?: string;
  seriesName?: string;
  brandLogoUrl?: string;
  /** vehicle-options'ta seçilen renk id'leri. */
  colorIds: string[];
  offerFeeTry: number;
}

const KEYS = {
  brandId: "b",
  brandName: "bn",
  modelId: "m",
  engineId: "e",
  engineName: "en",
  trimName: "tn",
  seriesName: "sn",
  brandLogoUrl: "bl",
  colorIds: "c",
  fee: "fee",
} as const;

export function selectionToParams(sel: VehicleSelection): URLSearchParams {
  const p = new URLSearchParams();
  p.set(KEYS.brandId, sel.brandId);
  p.set(KEYS.brandName, sel.brandName);
  p.set(KEYS.modelId, sel.modelId);
  p.set(KEYS.engineId, sel.engineId);
  p.set(KEYS.engineName, sel.engineName);
  if (sel.trimName) p.set(KEYS.trimName, sel.trimName);
  if (sel.seriesName) p.set(KEYS.seriesName, sel.seriesName);
  if (sel.brandLogoUrl) p.set(KEYS.brandLogoUrl, sel.brandLogoUrl);
  if (sel.colorIds.length) p.set(KEYS.colorIds, sel.colorIds.join(","));
  if (sel.offerFeeTry) p.set(KEYS.fee, String(sel.offerFeeTry));
  return p;
}

export function selectionToQueryString(sel: VehicleSelection): string {
  return selectionToParams(sel).toString();
}

type ParamsLike = {
  [key: string]: string | string[] | undefined;
};

function first(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

/** searchParams (Next.js) → VehicleSelection; zorunlu alanlar yoksa null. */
export function parseSelection(params: ParamsLike): VehicleSelection | null {
  const brandId = first(params[KEYS.brandId]);
  const brandName = first(params[KEYS.brandName]);
  const modelId = first(params[KEYS.modelId]);
  const engineId = first(params[KEYS.engineId]);
  const engineName = first(params[KEYS.engineName]);

  if (!brandId || !brandName || !modelId || !engineId || !engineName) {
    return null;
  }

  const colorRaw = first(params[KEYS.colorIds]);
  const feeRaw = first(params[KEYS.fee]);

  return {
    brandId,
    brandName,
    modelId,
    engineId,
    engineName,
    trimName: first(params[KEYS.trimName]),
    seriesName: first(params[KEYS.seriesName]),
    brandLogoUrl: first(params[KEYS.brandLogoUrl]),
    colorIds: colorRaw ? colorRaw.split(",").filter(Boolean) : [],
    offerFeeTry: feeRaw ? Number(feeRaw) || 199 : 199,
  };
}
