import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { PlusIcon } from "@/components/ui/icons";
import { MyListingsView } from "@/components/listings/my-listings-view";
import { getMyListings } from "@/lib/api/queries";
import type { ListingDto } from "@/lib/api/types";
import { Routes } from "@/lib/routes";

export const metadata: Metadata = { title: "İlanlarım" };

export default async function MyListingsPage() {
  let listings: ListingDto[] = [];
  let error: string | null = null;
  try {
    listings = await getMyListings();
  } catch (e) {
    error = e instanceof Error ? e.message : "İlanlar yüklenemedi.";
  }

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

      {error ? (
        <p className="rounded-2xl border border-danger/30 bg-danger/10 p-4 text-body-md text-danger">
          {error}
        </p>
      ) : (
        <MyListingsView listings={listings} />
      )}
    </div>
  );
}
