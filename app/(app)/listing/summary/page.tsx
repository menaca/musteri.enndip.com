import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { BackBar } from "@/components/layout/back-bar";
import { VehicleShowcaseCard } from "@/components/listing/vehicle-showcase-card";
import { resolveListingHero } from "@/lib/listing/hero";
import { parseSelection, selectionToQueryString } from "@/lib/listing/selection";
import { Routes } from "@/lib/routes";

export const metadata: Metadata = { title: "İlan Özeti" };

export default async function ListingSummaryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const selection = parseSelection(sp);
  if (!selection) redirect(Routes.findCar);

  const hero = await resolveListingHero(selection.modelId, selection.colorIds);
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
          modelName={hero.modelName || ""}
          engineName={selection.engineName}
          trimName={selection.trimName}
          brandLogoUrl={selection.brandLogoUrl}
          imageUrl={hero.imageUrl}
          selectedColors={hero.selectedColors}
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
