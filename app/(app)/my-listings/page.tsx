import type { Metadata } from "next";
import { MyListingsPageClient } from "@/components/listings/my-listings-page-client";

export const metadata: Metadata = { title: "İlanlarım" };

export default function MyListingsPage() {
  return <MyListingsPageClient />;
}
