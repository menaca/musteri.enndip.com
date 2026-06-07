import { ShimmerBox } from "@/components/ui/shimmer";
import {
  BackBarSkeleton,
  FilterChipsSkeleton,
  ListRowsSkeleton,
  PageHeaderSkeleton,
  PageShell,
  SettingsGroupSkeleton,
  VehicleShowcaseCardSkeleton,
} from "./shared";

/** Anasayfa — marka şeridi, ilanlar, CTA, kategoriler. */
export function HomePageSkeleton() {
  return (
    <PageShell>
      <div className="flex flex-col gap-10">
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <ShimmerBox key={i} rounded="rounded-full" className="h-16 w-16 shrink-0" />
          ))}
        </div>

        <div>
          <ShimmerBox rounded="rounded-md" className="mb-4 h-6 w-40" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ShimmerBox key={i} rounded="rounded-3xl" className="aspect-[16/12]" />
            ))}
          </div>
        </div>

        <ShimmerBox rounded="rounded-3xl" className="h-40 w-full" />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ShimmerBox key={i} rounded="rounded-3xl" className="aspect-[16/10]" />
          ))}
        </div>
      </div>
    </PageShell>
  );
}

/** Hesabım — avatar + form alanları. */
export function AccountPageSkeleton() {
  return (
    <PageShell maxWidth="max-w-2xl">
      <PageHeaderSkeleton />
      <div className="mb-8 flex items-center gap-4">
        <ShimmerBox rounded="rounded-full" className="h-16 w-16 shrink-0" />
        <div className="flex flex-col gap-2">
          <ShimmerBox rounded="rounded-md" className="h-5 w-40" />
          <ShimmerBox rounded="rounded-md" className="h-3.5 w-28" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <ShimmerBox rounded="rounded-md" className="h-3.5 w-20" />
            <ShimmerBox rounded="rounded-2xl" className="h-12 w-full" />
          </div>
        ))}
        <ShimmerBox rounded="rounded-pill" className="mt-2 h-12 w-full" />
      </div>
    </PageShell>
  );
}

/** İlanlarım — filtre chip'leri + ilan kartları. */
export function MyListingsPageSkeleton() {
  return (
    <PageShell maxWidth="max-w-3xl">
      <PageHeaderSkeleton showAction />
      <FilterChipsSkeleton />
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-3xl border border-line bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-center gap-2">
                <ShimmerBox rounded="rounded-md" className="h-5 w-44" />
                <ShimmerBox rounded="rounded-pill" className="h-6 w-16" />
              </div>
              <ShimmerBox rounded="rounded-md" className="h-3.5 w-32" />
              <div className="flex gap-4">
                <ShimmerBox rounded="rounded-md" className="h-3.5 w-20" />
                <ShimmerBox rounded="rounded-md" className="h-3.5 w-24" />
              </div>
            </div>
            <ShimmerBox rounded="rounded-pill" className="h-10 w-32 shrink-0" />
          </div>
        ))}
      </div>
    </PageShell>
  );
}

/** Araç Bul — wizard adım chip'leri + marka listesi. */
export function FindCarPageSkeleton() {
  return (
    <PageShell maxWidth="max-w-2xl">
      <div className="mb-4">
        <BackBarSkeleton />
      </div>
      <ShimmerBox rounded="rounded-md" className="mx-auto h-8 w-4/5 max-w-md" />
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <ShimmerBox key={i} rounded="rounded-pill" className="h-9 w-24" />
        ))}
      </div>
      <div className="mt-6 rounded-3xl bg-cream p-2 sm:p-3">
        <ListRowsSkeleton count={8} />
      </div>
    </PageShell>
  );
}

/** Tercihler / Bildirimler — ayar grupları. */
export function SettingsPageSkeleton({ groups = 2 }: { groups?: number }) {
  return (
    <PageShell maxWidth="max-w-2xl">
      <PageHeaderSkeleton />
      <div className="flex flex-col gap-6">
        {Array.from({ length: groups }).map((_, i) => (
          <SettingsGroupSkeleton key={i} tiles={i === 0 ? 2 : 3} titleWidth={i === 0 ? "w-20" : "w-28"} />
        ))}
      </div>
    </PageShell>
  );
}

/** Bildirimler — liste kartları. */
export function NotificationsPageSkeleton() {
  return (
    <PageShell maxWidth="max-w-2xl">
      <PageHeaderSkeleton />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-line bg-card p-4">
            <div className="flex items-start gap-3">
              <ShimmerBox rounded="rounded-xl" className="h-10 w-10 shrink-0" />
              <div className="flex flex-1 flex-col gap-2">
                <ShimmerBox rounded="rounded-md" className="h-4 w-36" />
                <ShimmerBox rounded="rounded-md" className="h-3.5 w-full" />
                <ShimmerBox rounded="rounded-md" className="h-3 w-2/3" />
                <ShimmerBox rounded="rounded-md" className="h-3 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

/** Enndipten Al — bilgi bandı + araç grid'i. */
export function BuyFromEnndipPageSkeleton() {
  return (
    <PageShell maxWidth="max-w-4xl">
      <PageHeaderSkeleton />
      <div className="mb-6 flex items-start gap-3 rounded-2xl bg-cream p-4">
        <ShimmerBox rounded="rounded-xl" className="h-10 w-10 shrink-0" />
        <div className="flex flex-1 flex-col gap-2">
          <ShimmerBox rounded="rounded-md" className="h-5 w-44" />
          <ShimmerBox rounded="rounded-md" className="h-3.5 w-full" />
          <ShimmerBox rounded="rounded-md" className="h-3.5 w-4/5" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-3xl border border-line bg-card">
            <ShimmerBox rounded="rounded-none" className="aspect-[16/11] w-full" />
            <div className="flex flex-col gap-2 p-4">
              <ShimmerBox rounded="rounded-md" className="h-4 w-3/4" />
              <ShimmerBox rounded="rounded-md" className="h-3.5 w-1/2" />
              <ShimmerBox rounded="rounded-md" className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

/** İletişim — açıklama + kanal listesi. */
export function ContactPageSkeleton() {
  return (
    <PageShell maxWidth="max-w-2xl">
      <PageHeaderSkeleton />
      <ShimmerBox rounded="rounded-md" className="mb-6 h-4 w-full max-w-lg" />
      <SettingsGroupSkeleton tiles={3} titleWidth="w-16" />
    </PageShell>
  );
}

/** Nasıl Çalışır — adım kartları + CTA. */
export function HowItWorksPageSkeleton() {
  return (
    <PageShell maxWidth="max-w-2xl">
      <PageHeaderSkeleton />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start gap-4 rounded-3xl border border-line bg-card p-5">
            <ShimmerBox rounded="rounded-full" className="h-11 w-11 shrink-0" />
            <div className="flex flex-1 flex-col gap-2">
              <ShimmerBox rounded="rounded-md" className="h-5 w-40" />
              <ShimmerBox rounded="rounded-md" className="h-3.5 w-full" />
              <ShimmerBox rounded="rounded-md" className="h-3.5 w-4/5" />
            </div>
          </div>
        ))}
      </div>
      <ShimmerBox rounded="rounded-pill" className="mt-8 h-12 w-full" />
    </PageShell>
  );
}

/** Araç seçenekleri — görsel, renkler, teknik özellikler. */
export function VehicleOptionsPageSkeleton() {
  return (
    <PageShell maxWidth="max-w-3xl">
      <div className="mb-4">
        <BackBarSkeleton />
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-1 flex-col gap-2">
          <ShimmerBox rounded="rounded-md" className="h-8 w-56" />
          <ShimmerBox rounded="rounded-md" className="h-4 w-40" />
        </div>
        <ShimmerBox rounded="rounded-md" className="h-4 w-16 shrink-0" />
      </div>
      <ShimmerBox rounded="rounded-3xl" className="mt-5 aspect-[16/10] w-full" />
      <div className="mt-3 flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <ShimmerBox key={i} rounded="rounded-xl" className="h-16 w-24 shrink-0" />
        ))}
      </div>
      <div className="mt-8 space-y-3">
        <ShimmerBox rounded="rounded-md" className="h-6 w-32" />
        <ShimmerBox rounded="rounded-md" className="h-3.5 w-full max-w-md" />
        <div className="mt-4 flex flex-wrap gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <ShimmerBox key={i} rounded="rounded-pill" className="h-9 w-28" />
          ))}
        </div>
      </div>
      <div className="mt-8 space-y-3">
        <ShimmerBox rounded="rounded-md" className="h-6 w-36" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-1.5 rounded-2xl border border-line p-3">
              <ShimmerBox rounded="rounded-md" className="h-3 w-16" />
              <ShimmerBox rounded="rounded-md" className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
      <ShimmerBox rounded="rounded-pill" className="mt-10 h-12 w-full" />
    </PageShell>
  );
}

/** İlan özeti / teklif — vitrin kartı + aksiyonlar. */
export function ListingFlowPageSkeleton({ withFee = false }: { withFee?: boolean }) {
  return (
    <PageShell maxWidth="max-w-3xl">
      <div className="mb-4">
        <BackBarSkeleton />
      </div>
      <ShimmerBox rounded="rounded-md" className="mx-auto h-8 w-4/5 max-w-lg" />
      <div className="mt-8">
        <VehicleShowcaseCardSkeleton />
      </div>
      {withFee && (
        <div className="mt-5 rounded-3xl border border-line bg-card p-5">
          <ShimmerBox rounded="rounded-md" className="h-5 w-32" />
          <ShimmerBox rounded="rounded-md" className="mt-2 h-4 w-full" />
          <ShimmerBox rounded="rounded-md" className="mt-1 h-4 w-3/4" />
        </div>
      )}
      <div className="mt-8 flex flex-col gap-3">
        <ShimmerBox rounded="rounded-pill" className="h-12 w-full" />
        <ShimmerBox rounded="rounded-md" className="mx-auto h-4 w-36" />
      </div>
    </PageShell>
  );
}
