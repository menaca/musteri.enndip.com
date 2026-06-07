import "server-only";

import { apiFetch } from "./server";
import { toPublicImageryUrl } from "./imagery-url";
import { Endpoints } from "./endpoints";
import type {
  OnboardingSlideDto,
  HomeFeedDto,
  BrandDto,
  CarSeriesDto,
  CarSeriesTrimDto,
  CarEngineDto,
  CarModelDetailDto,
  CarModelColorDto,
  CarModelPanelSpecDto,
  CarModelBundleDto,
  UserProfileDto,
  ListingDto,
  VehicleImageryGalleryDto,
  VehicleImagerySpinDto,
} from "./types";

const CATALOG_REVALIDATE = 60 * 30; // 30 dk — katalog yavaş değişir
/** Kişisel veri — Next.js Data Cache (Bearer başına ayrı giriş). Mutasyonlarda revalidatePath ile tazelenir. */
const USER_FEED_REVALIDATE = 30;
const USER_LISTINGS_REVALIDATE = 60;
const USER_PROFILE_REVALIDATE = 120;

// ----- Onboarding -----
export function getOnboardingSlide(locale = "tr") {
  return apiFetch<OnboardingSlideDto>(Endpoints.onboardingSlide(locale), {
    auth: "none",
    revalidate: 60 * 10,
  });
}

// ----- Home -----
export async function getHomeFeed() {
  // Oturumluysa kişiselleşir → güncel olmalı.
  const feed = await apiFetch<HomeFeedDto>(Endpoints.homeFeed, {
    auth: "optional",
    revalidate: USER_FEED_REVALIDATE,
  });
  return {
    ...feed,
    activeListings: feed.activeListings.map((listing) => ({
      ...listing,
      previewImageUrl: listing.previewImageUrl
        ? toPublicImageryUrl(listing.previewImageUrl)
        : null,
    })),
  };
}

// ----- Catalog -----
export function getBrands(categorySlug?: string) {
  return apiFetch<BrandDto[]>(Endpoints.brands(categorySlug), {
    auth: "none",
    revalidate: CATALOG_REVALIDATE,
  });
}

export function getSeries(brandId: string, categorySlug?: string) {
  return apiFetch<CarSeriesDto[]>(Endpoints.series(brandId, categorySlug), {
    auth: "none",
    revalidate: CATALOG_REVALIDATE,
  });
}

export function getTrims(seriesId: string, categorySlug?: string) {
  return apiFetch<CarSeriesTrimDto[]>(Endpoints.trims(seriesId, categorySlug), {
    auth: "none",
    revalidate: CATALOG_REVALIDATE,
  });
}

export function getEngines(seriesId: string, trimId: string, categorySlug?: string) {
  return apiFetch<CarEngineDto[]>(Endpoints.engines(seriesId, trimId, categorySlug), {
    auth: "none",
    revalidate: CATALOG_REVALIDATE,
  });
}

export async function getModelBundle(modelId: string) {
  const bundle = await apiFetch<CarModelBundleDto>(Endpoints.modelBundle(modelId), {
    auth: "none",
    revalidate: CATALOG_REVALIDATE,
  });
  return {
    ...bundle,
    detail: {
      ...bundle.detail,
      previewImageUrl: bundle.detail.previewImageUrl
        ? toPublicImageryUrl(bundle.detail.previewImageUrl)
        : null,
      previewImageUrls: bundle.detail.previewImageUrls?.map(toPublicImageryUrl) ?? [],
    },
  };
}

export async function getModelDetail(modelId: string) {
  const detail = await apiFetch<CarModelDetailDto>(Endpoints.modelDetail(modelId), {
    auth: "none",
    revalidate: CATALOG_REVALIDATE,
  });
  return {
    ...detail,
    previewImageUrl: detail.previewImageUrl
      ? toPublicImageryUrl(detail.previewImageUrl)
      : null,
    previewImageUrls: detail.previewImageUrls?.map(toPublicImageryUrl) ?? [],
  };
}

export async function getModelPanelSpec(modelId: string) {
  try {
    return await apiFetch<CarModelPanelSpecDto>(Endpoints.modelPanelSpec(modelId), {
      auth: "none",
      revalidate: CATALOG_REVALIDATE,
    });
  } catch {
    return null; // 404 — panel spec olmayabilir
  }
}

export function getModelColors(modelId: string) {
  return apiFetch<CarModelColorDto[]>(Endpoints.modelColors(modelId), {
    auth: "none",
    revalidate: CATALOG_REVALIDATE,
  });
}

// ----- Vehicle imagery -----
export async function getImageryGallery(
  modelId: string,
  paintId?: string,
  paintDescription?: string,
) {
  const dto = await apiFetch<VehicleImageryGalleryDto>(
    Endpoints.imageryGallery(modelId, paintId, paintDescription),
    { auth: "none", revalidate: 60 * 60 },
  );
  return {
    ...dto,
    slides: dto.slides.map((s) => ({ ...s, url: toPublicImageryUrl(s.url) })),
  };
}

export async function getImagerySpin(
  modelId: string,
  paintId?: string,
  paintDescription?: string,
) {
  const dto = await apiFetch<VehicleImagerySpinDto>(
    Endpoints.imagerySpin(modelId, paintId, paintDescription),
    { auth: "none", revalidate: 60 * 60 },
  );
  return {
    ...dto,
    frames: dto.frames.map((f) => ({ ...f, url: toPublicImageryUrl(f.url) })),
  };
}

// ----- Users -----
export function getMyProfile() {
  return apiFetch<UserProfileDto>(Endpoints.me, {
    auth: "required",
    revalidate: USER_PROFILE_REVALIDATE,
  });
}

// ----- Listings -----
export function getMyListings() {
  return apiFetch<ListingDto[]>(Endpoints.listings, {
    auth: "required",
    revalidate: USER_LISTINGS_REVALIDATE,
  });
}
