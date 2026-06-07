import type { Metadata } from "next";
import { Suspense } from "react";
import { ListingOfferPageClient } from "@/components/listing/listing-offer-page-client";
import { ListingFlowPageSkeleton } from "@/components/skeletons/pages";

export const metadata: Metadata = { title: "Teklif Ver" };

export default function ListingOfferPage() {
  return (
    <Suspense fallback={<ListingFlowPageSkeleton withFee />}>
      <ListingOfferPageClient />
    </Suspense>
  );
}
