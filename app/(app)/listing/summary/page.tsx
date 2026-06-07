import type { Metadata } from "next";
import { Suspense } from "react";
import { ListingSummaryPageClient } from "@/components/listing/listing-summary-page-client";
import { ListingFlowPageSkeleton } from "@/components/skeletons/pages";

export const metadata: Metadata = { title: "İlan Özeti" };

export default function ListingSummaryPage() {
  return (
    <Suspense fallback={<ListingFlowPageSkeleton />}>
      <ListingSummaryPageClient />
    </Suspense>
  );
}
