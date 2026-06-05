import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { BuyFromEnndipView } from "@/components/buy-now/buy-from-enndip-view";

export const metadata: Metadata = { title: "Enndipten Al" };

export default function BuyFromEnndipPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-6 sm:px-6 lg:px-10 lg:py-10">
      <PageHeader
        title="Enndipten Al"
        subtitle="Bayilerin hemen satmak istediği hazır fiyatlı sıfır araçlar. Beklemeden, anında satın al."
      />
      <BuyFromEnndipView />
    </div>
  );
}
