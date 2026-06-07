/** Same-origin BFF JSON uçları (tarayıcıdan çağrılır). */
export const BffRoutes = {
  session: "/api/bff/session",
  home: "/api/bff/home",
  listings: "/api/bff/listings",
  profile: "/api/bff/me",
  brands: (category?: string) => {
    const q = category ? `?category=${encodeURIComponent(category)}` : "";
    return `/api/bff/brands${q}`;
  },
  series: (brandId: string, category?: string) => {
    const params = new URLSearchParams({ brandId });
    if (category) params.set("category", category);
    return `/api/bff/series?${params.toString()}`;
  },
  modelBundle: (modelId: string) => `/api/bff/models/${modelId}/bundle`,
} as const;
