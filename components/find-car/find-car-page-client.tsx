"use client";

import { useSearchParams } from "next/navigation";
import { FindCarWizard } from "@/components/find-car/find-car-wizard";
import { FindCarPageSkeleton } from "@/components/skeletons/pages";
import { useBrands, useSeries } from "@/lib/query/hooks";

export function FindCarPageClient() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? undefined;
  const brandId = searchParams.get("brand") ?? undefined;

  const { data: brands, isLoading: brandsLoading } = useBrands(category);
  const { data: initialSeries, isLoading: seriesLoading } = useSeries(brandId, category);

  const brandList = brands ?? [];
  const preselectedBrand = brandId
    ? brandList.find((b) => b.id === brandId) ?? null
    : null;

  if (brandsLoading && brandList.length === 0) {
    return <FindCarPageSkeleton />;
  }

  if (brandId && seriesLoading && preselectedBrand && initialSeries === undefined) {
    return <FindCarPageSkeleton />;
  }

  return (
    <div className="px-5 py-6 sm:px-6 lg:px-10 lg:py-10">
      <FindCarWizard
        brands={brandList}
        category={category}
        preselectedBrand={preselectedBrand}
        initialSeries={preselectedBrand ? (initialSeries ?? []) : null}
      />
    </div>
  );
}
