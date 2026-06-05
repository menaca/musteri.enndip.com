import Link from "next/link";
import { SectionHeader } from "@/components/ui/section-header";
import { RemoteImage } from "@/components/ui/remote-image";
import { PlusIcon } from "@/components/ui/icons";
import { formatRemaining } from "@/lib/format";
import type { ActiveListingDto } from "@/lib/api/types";
import { Routes } from "@/lib/routes";

function ColorDots({ hexes, extra }: { hexes: string[]; extra: number }) {
  if (!hexes.length) return null;
  return (
    <div className="flex items-center gap-1">
      {hexes.slice(0, 4).map((hex, i) => (
        <span
          key={i}
          className="h-3.5 w-3.5 rounded-full border border-line"
          style={{ backgroundColor: hex }}
        />
      ))}
      {extra > 0 && <span className="text-xs font-medium text-muted">+{extra}</span>}
    </div>
  );
}

function ActiveListingCard({ listing }: { listing: ActiveListingDto }) {
  const expired = new Date(listing.expiresAt).getTime() <= Date.now();
  return (
    <Link
      href={Routes.myListings}
      className="group flex w-[260px] shrink-0 flex-col overflow-hidden rounded-3xl border border-line bg-card transition-shadow hover:shadow-card lg:w-auto"
    >
      <RemoteImage
        src={listing.previewImageUrl}
        alt={`${listing.brandName} ${listing.modelName}`}
        wrapperClassName="aspect-[16/10] w-full"
        sizes="260px"
      />
      <div className="flex flex-col gap-2 p-4">
        <p className="text-heading-sm leading-snug">
          {listing.brandName} {listing.modelName}
        </p>
        <p className="text-body-sm">{listing.engineName}</p>
        <div className="mt-1 flex items-center justify-between">
          <ColorDots hexes={listing.colorHexes} extra={listing.extraColorCount} />
          <span className="text-xs font-semibold text-muted">
            {expired ? "Teklifler toplandı" : `${formatRemaining(listing.expiresAt)} · Teklifler toplanıyor`}
          </span>
        </div>
      </div>
    </Link>
  );
}

function CreateListingCard() {
  return (
    <Link
      href={Routes.findCar}
      className="flex w-[260px] shrink-0 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-line-strong bg-paper p-6 text-center transition-colors hover:border-ink-900 hover:bg-cream lg:w-auto lg:min-h-[220px]"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream text-ink-900">
        <PlusIcon size={24} />
      </span>
      <span className="text-heading-sm">Yeni İlan Oluştur</span>
    </Link>
  );
}

export function ActiveListingsSection({
  listings,
}: {
  listings: ActiveListingDto[];
}) {
  return (
    <section>
      <SectionHeader
        title="Aktif İlanlarım"
        actionLabel="Tümünü Gör"
        actionHref={Routes.myListings}
      />
      <div className="no-scrollbar mt-4 flex gap-4 overflow-x-auto pb-1 lg:grid lg:grid-cols-3 lg:overflow-visible xl:grid-cols-4">
        {listings.map((l) => (
          <ActiveListingCard key={l.id} listing={l} />
        ))}
        <CreateListingCard />
      </div>
    </section>
  );
}
