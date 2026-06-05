import type { Metadata } from "next";
import { FindCarWizard } from "@/components/find-car/find-car-wizard";
import { getBrands, getSeries } from "@/lib/api/queries";
import type { BrandDto, CarSeriesDto } from "@/lib/api/types";

export const metadata: Metadata = { title: "Aracını Bulalım" };

export default async function FindCarPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string; category?: string }>;
}) {
  const { brand: brandId, category } = await searchParams;

  let brands: BrandDto[] = [];
  try {
    brands = await getBrands(category);
  } catch {
    brands = [];
  }

  let preselectedBrand: BrandDto | null = null;
  let initialSeries: CarSeriesDto[] | null = null;
  if (brandId) {
    preselectedBrand = brands.find((b) => b.id === brandId) ?? null;
    if (preselectedBrand) {
      try {
        initialSeries = await getSeries(preselectedBrand.id, category);
      } catch {
        initialSeries = [];
      }
    }
  }

  return (
    <div className="px-5 py-6 sm:px-6 lg:px-10 lg:py-10">
      <FindCarWizard
        brands={brands}
        category={category}
        preselectedBrand={preselectedBrand}
        initialSeries={initialSeries}
      />
    </div>
  );
}
