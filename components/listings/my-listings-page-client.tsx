"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { PlusIcon } from "@/components/ui/icons";
import { MyListingsView } from "@/components/listings/my-listings-view";
import { MyListingsPageSkeleton } from "@/components/skeletons/pages";
import { useMyListings } from "@/lib/query/hooks";
import { BffError } from "@/lib/bff/client-fetch";
import { Routes } from "@/lib/routes";

export function MyListingsPageClient() {
  const { data: listings, isLoading, error } = useMyListings();

  if (isLoading && listings === undefined) {
    return <MyListingsPageSkeleton />;
  }

  const authError = error instanceof BffError && error.status === 401;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-6 sm:px-6 lg:px-10 lg:py-10">
      <PageHeader
        title="İlanlarım"
        subtitle="Oluşturduğun ilanları ve aldıkları teklifleri takip et."
        action={
          <Link href={Routes.findCar} className="btn-primary hidden sm:inline-flex">
            <PlusIcon size={18} className="text-paper" /> Yeni İlan
          </Link>
        }
      />

      {authError || (error && !listings) ? (
        <p className="rounded-2xl border border-danger/30 bg-danger/10 p-4 text-body-md text-danger">
          {authError
            ? "İlanlarını görmek için giriş yapmalısın."
            : error instanceof Error
              ? error.message
              : "İlanlar yüklenemedi."}
        </p>
      ) : (
        <MyListingsView listings={listings ?? []} />
      )}
    </div>
  );
}
