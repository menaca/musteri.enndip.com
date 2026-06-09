/**
 * NestJS Core API (/api/v1) DTO tipleri.
 * Kaynak: backend modules dto klasorleri. Tek dogru kaynak backend'dir.
 */

// ----- Onboarding -----
export interface OnboardingSlideDto {
  id: string;
  imageUrl: string;
  title: string;
  description?: string | null;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel?: string | null;
  locale: string;
}

// ----- Catalog -----
export interface BrandDto {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  isFeatured: boolean;
}

export interface CarSeriesDto {
  id: string;
  brandId: string;
  name: string;
  slug: string;
}

export interface CarSeriesTrimDto {
  id: string;
  seriesId: string;
  name: string;
  slug: string;
}

export interface CarEngineDto {
  id: string;
  /** Motor seçimi modeli belirler — vehicle-options bu modelId ile yüklenir. */
  modelId: string;
  name: string;
  fuelType?: string | null;
}

export interface CarModelColorDto {
  id: string;
  modelId: string;
  name: string;
  hexCode: string;
  imaginPaintId?: string | null;
  imaginPaintDescription?: string | null;
}

export interface CarModelDetailDto {
  id: string;
  brandId: string;
  name: string;
  slug: string;
  websiteUrl?: string | null;
  previewImageUrl?: string | null;
  previewImageUrls?: string[];
}

/** Listing akışı — detay + panel spec + renkler (tek istek). */
export interface CarModelBundleDto {
  detail: CarModelDetailDto;
  panelSpec: CarModelPanelSpecDto | null;
  colors: CarModelColorDto[];
}

export interface CarModelEquipmentItem {
  label: string;
  value?: string | null;
}

export interface CarModelPanelSpecDto {
  modelId: string;
  seriesId?: string | null;
  trimId?: string | null;
  series?: string | null;
  trimPackageName?: string | null;
  modelYear?: number | null;
  bodyStyle?: string | null;
  transmission?: string | null;
  driveType?: string | null;
  engineDisplacementCc?: number | null;
  fuelType?: string | null;
  powerKw?: number | null;
  powerHp?: number | null;
  warrantyMonths?: number | null;
  serviceIntervalKm?: number | null;
  equipmentItems?: CarModelEquipmentItem[];
  colorScaleItems?: { name: string; hex: string }[];
}

// ----- Ads -----
export interface HomeAdDto {
  id: string;
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  linkUrl?: string | null;
  brand?: string | null;
}

// ----- Home feed -----
export interface ActiveListingDto {
  id: string;
  status: string;
  expiresAt: string;
  brandName: string;
  modelName: string;
  engineName: string;
  colorHexes: string[];
  extraColorCount: number;
  previewImageUrl?: string | null;
}

export interface VehicleCategoryDto {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
}

export interface HomeFeedDto {
  featuredBrands: BrandDto[];
  activeListings: ActiveListingDto[];
  ads: HomeAdDto[];
  categories: VehicleCategoryDto[];
}

// ----- Users -----
export type UserRole =
  | "user"
  | "dealer"
  | "admin"
  | "call_center_agent"
  | "call_center_supervisor";

export interface UserProfileDto {
  id: string;
  email: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  role: UserRole;
  registrationSource?: string | null;
}

export interface UpdateProfileDto {
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
}

// ----- Listings -----
export interface ListingDto {
  id: string;
  status: string;
  expiresAt: string;
  brandId: string;
  modelId: string;
  engineId: string;
  brandName: string;
  modelName: string;
  engineName: string;
  bidCount: number;
}

export interface ListingColorPreferenceDto {
  name: string;
  hexCode: string;
}

export interface CreateListingDto {
  brandId: string;
  modelId: string;
  engineId: string;
  colorPreferences?: ListingColorPreferenceDto[];
  durationHours?: number;
}

// ----- Vehicle imagery -----
export interface ImagerySlide {
  angle: number;
  url: string;
}

export interface VehicleImageryGalleryDto {
  modelId: string;
  paintId?: string | null;
  paintDescription?: string | null;
  source: string;
  slides: ImagerySlide[];
}

export interface VehicleImagerySpinDto {
  modelId: string;
  paintId?: string | null;
  paintDescription?: string | null;
  frames: ImagerySlide[];
}
