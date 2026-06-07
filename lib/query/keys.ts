/** TanStack Query cache anahtarları — invalidation için tek kaynak. */
export const queryKeys = {
  session: ["bff", "session"] as const,
  home: ["bff", "home"] as const,
  listings: ["bff", "listings"] as const,
  profile: ["bff", "profile"] as const,
  brands: (category?: string) => ["bff", "brands", category ?? "all"] as const,
  series: (brandId: string, category?: string) =>
    ["bff", "series", brandId, category ?? "all"] as const,
  modelBundle: (modelId: string) => ["bff", "model-bundle", modelId] as const,
};
