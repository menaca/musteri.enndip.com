"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { VehicleOptions } from "@/components/listing/vehicle-options";
import { VehicleOptionsPageSkeleton } from "@/components/skeletons/pages";
import { useModelBundle } from "@/lib/query/hooks";
import { parseSelection } from "@/lib/listing/selection";
import { resolveListingColors } from "@/lib/listing/bundle-colors";
import { Routes } from "@/lib/routes";

export function VehicleOptionsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selection = parseSelection(
    Object.fromEntries(searchParams.entries()),
  );

  useEffect(() => {
    if (!selection) router.replace(Routes.findCar);
  }, [selection, router]);

  const { data: bundle, isLoading, error } = useModelBundle(selection?.modelId);

  if (!selection) return null;

  if (isLoading && !bundle) {
    return (
      <div className="px-5 py-6 sm:px-6 lg:px-10 lg:py-10">
        <VehicleOptionsPageSkeleton />
      </div>
    );
  }

  if (error || !bundle) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-6 sm:px-6 lg:px-10 lg:py-10">
        <p className="rounded-2xl border border-danger/30 bg-danger/10 p-4 text-body-md text-danger">
          {error instanceof Error ? error.message : "Araç verisi yüklenemedi."}
        </p>
      </div>
    );
  }

  const colors = resolveListingColors(
    selection.modelId,
    bundle.colors,
    bundle.panelSpec,
  );

  return (
    <div className="px-5 py-6 sm:px-6 lg:px-10 lg:py-10">
      <VehicleOptions
        selection={selection}
        modelName={bundle.detail.name ?? selection.brandName}
        modelWebsiteUrl={bundle.detail.websiteUrl ?? null}
        colors={colors}
        panelSpec={bundle.panelSpec}
        previewImages={bundle.detail.previewImageUrls ?? []}
      />
    </div>
  );
}
