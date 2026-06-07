import type { Metadata } from "next";
import { Suspense } from "react";
import { VehicleOptionsPageClient } from "@/components/listing/vehicle-options-page-client";
import { VehicleOptionsPageSkeleton } from "@/components/skeletons/pages";

export const metadata: Metadata = { title: "Araç Seçenekleri" };

export default function VehicleOptionsPage() {
  return (
    <Suspense fallback={<VehicleOptionsPageSkeleton />}>
      <VehicleOptionsPageClient />
    </Suspense>
  );
}
