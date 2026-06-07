"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BackBar } from "@/components/layout/back-bar";
import { VehicleShowcaseCard } from "@/components/listing/vehicle-showcase-card";
import { OfferFeeInfoCard } from "@/components/listing/offer-fee-info-card";
import { OfferActions } from "@/components/listing/offer-actions";
import { ListingFlowPageSkeleton } from "@/components/skeletons/pages";
import { useModelBundle } from "@/lib/query/hooks";
import { buildListingHeroFromBundle } from "@/lib/listing/hero-client";
import { parseSelection } from "@/lib/listing/selection";
import { Routes } from "@/lib/routes";

export function ListingOfferPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selection = parseSelection(
    Object.fromEntries(searchParams.entries()),
  );

  useEffect(() => {
    if (!selection) router.replace(Routes.findCar);
  }, [selection, router]);

  const { data: bundle, isLoading } = useModelBundle(selection?.modelId);

  const hero = useMemo(
    () => (bundle && selection ? buildListingHeroFromBundle(bundle, selection.colorIds) : null),
    [bundle, selection],
  );

  if (!selection) return null;

  if (isLoading && !bundle) {
    return (
      <div className="px-5 py-6 sm:px-6 lg:px-10 lg:py-10">
        <ListingFlowPageSkeleton withFee />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-6 sm:px-6 lg:px-10 lg:py-10">
      <div className="mb-4">
        <BackBar fallbackHref={Routes.listingSummary} />
      </div>

      <h1 className="text-display-md">Araç Bilgisi</h1>

      <div className="mt-6">
        <VehicleShowcaseCard
          brandName={selection.brandName}
          modelName={hero?.modelName || ""}
          engineName={selection.engineName}
          trimName={selection.trimName}
          brandLogoUrl={selection.brandLogoUrl}
          imageUrl={hero?.imageUrl}
          selectedColors={hero?.selectedColors ?? []}
        />
      </div>

      <div className="mt-5">
        <OfferFeeInfoCard amountTry={selection.offerFeeTry} />
      </div>

      <OfferActions selection={selection} />
    </div>
  );
}
