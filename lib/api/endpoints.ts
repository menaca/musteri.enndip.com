/** NestJS endpoint path'leri (API_BASE_URL'e göreli, /api/v1 dahil değildir — o tabanda). */
export const Endpoints = {
  health: "/health",

  onboardingSlide: (locale = "tr", app = "enndip") =>
    `/onboarding/slide?locale=${encodeURIComponent(locale)}&app=${encodeURIComponent(app)}`,

  homeFeed: "/home/feed",
  ads: "/ads",

  brands: (categorySlug?: string) =>
    `/catalog/brands${categorySlug ? `?categorySlug=${encodeURIComponent(categorySlug)}` : ""}`,
  series: (brandId: string, categorySlug?: string) =>
    `/catalog/brands/${brandId}/series${categorySlug ? `?categorySlug=${encodeURIComponent(categorySlug)}` : ""}`,
  trims: (seriesId: string, categorySlug?: string) =>
    `/catalog/series/${seriesId}/trims${categorySlug ? `?categorySlug=${encodeURIComponent(categorySlug)}` : ""}`,
  engines: (seriesId: string, trimId: string, categorySlug?: string) =>
    `/catalog/series/${seriesId}/trims/${trimId}/engines${categorySlug ? `?categorySlug=${encodeURIComponent(categorySlug)}` : ""}`,

  modelDetail: (modelId: string) => `/catalog/models/${modelId}`,
  modelPanelSpec: (modelId: string) => `/catalog/models/${modelId}/panel-spec`,
  modelColors: (modelId: string) => `/catalog/models/${modelId}/colors`,

  imageryGallery: (modelId: string, paintId?: string, paintDescription?: string) => {
    const params = new URLSearchParams();
    if (paintId) params.set("paintId", paintId);
    if (paintDescription) params.set("paintDescription", paintDescription);
    const q = params.toString();
    return `/vehicle-imagery/models/${modelId}/gallery${q ? `?${q}` : ""}`;
  },
  imagerySpin: (modelId: string, paintId?: string, paintDescription?: string) => {
    const params = new URLSearchParams();
    if (paintId) params.set("paintId", paintId);
    if (paintDescription) params.set("paintDescription", paintDescription);
    const q = params.toString();
    return `/vehicle-imagery/models/${modelId}/spin${q ? `?${q}` : ""}`;
  },

  me: "/users/me",
  listings: "/listings",
  listing: (id: string) => `/listings/${id}`,

  analyticsSessionStart: "/analytics/session/start",
  analyticsEvents: "/analytics/events",
} as const;
