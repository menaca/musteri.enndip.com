import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { BackBar } from "@/components/layout/back-bar";
import { VehicleShowcaseCard } from "@/components/listing/vehicle-showcase-card";
import { OfferFeeInfoCard } from "@/components/listing/offer-fee-info-card";
import { OfferActions } from "@/components/listing/offer-actions";
import { resolveListingHero } from "@/lib/listing/hero";
import { parseSelection } from "@/lib/listing/selection";
import { Routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Teklif Ver" };

export default async function ListingOfferPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const selection = parseSelection(sp);
  if (!selection) redirect(Routes.findCar);

  const hero = await resolveListingHero(selection.modelId, selection.colorIds);

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-6 sm:px-6 lg:px-10 lg:py-10">
      <div className="mb-4">
        <BackBar fallbackHref={Routes.listingSummary} />
      </div>

      <h1 className="text-display-md">Araç Bilgisi</h1>

      <div className="mt-6">
        <VehicleShowcaseCard
          brandName={selection.brandName}
          modelName={hero.modelName || ""}
          engineName={selection.engineName}
          trimName={selection.trimName}
          brandLogoUrl={selection.brandLogoUrl}
          imageUrl={hero.imageUrl}
          selectedColors={hero.selectedColors}
        />
      </div>

      <div className="mt-5">
        <OfferFeeInfoCard amountTry={selection.offerFeeTry} />
      </div>

      <OfferActions selection={selection} />
    </div>
  );
}
