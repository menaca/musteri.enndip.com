import type { Metadata } from "next";
import { Suspense } from "react";
import { FindCarPageClient } from "@/components/find-car/find-car-page-client";
import { FindCarPageSkeleton } from "@/components/skeletons/pages";

export const metadata: Metadata = { title: "Aracını Bulalım" };

export default function FindCarPage() {
  return (
    <Suspense fallback={<FindCarPageSkeleton />}>
      <FindCarPageClient />
    </Suspense>
  );
}
