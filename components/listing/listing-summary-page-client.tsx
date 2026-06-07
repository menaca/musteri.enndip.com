"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BackBar } from "@/components/layout/back-bar";
import { VehicleShowcaseCard } from "@/components/listing/vehicle-showcase-card";
import { ListingFlowPageSkeleton } from "@/components/skeletons/pages";
import { useModelBundle } from "@/lib/query/hooks";
import { buildListingHeroFromBundle } from "@/lib/listing/hero-client";
import { parseSelection, selectionToQueryString } from "@/lib/listing/selection";
import { Routes } from "@/lib/routes";

export function ListingSummaryPageClient() {
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
        <ListingFlowPageSkeleton />
      </div>
    );
  }

  const offerHref = `${Routes.listingOffer}?${selectionToQueryString(selection)}`;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-6 sm:px-6 lg:px-10 lg:py-10">
      <div className="mb-4">
        <BackBar fallbackHref={Routes.findCar} />
      </div>

      <h1 className="text-center text-heading-lg text-balance">
        Hangi araç için ilan oluşturmak istiyorsun?
      </h1>

      <div className="mt-8">
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

      <div className="mt-8 flex flex-col gap-3">
        <Link href={offerHref} className="btn-primary w-full">
          Teklif Ver
        </Link>
        <Link
          href={Routes.findCar}
          className="text-center text-body-sm font-semibold text-ink-900 hover:underline"
        >
          Başka bir araç bul
        </Link>
      </div>
    </div>
  );
}
