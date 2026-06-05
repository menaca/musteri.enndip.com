import Image from "next/image";
import { RemoteImage } from "@/components/ui/remote-image";
import { shouldBypassImageOptimizer } from "@/lib/image";
import type { ListingColorChoice } from "@/lib/listing/hero";

/** Araç vitrin kartı (summary/offer) — Flutter VehicleShowcaseCard. */
export function VehicleShowcaseCard({
  brandName,
  modelName,
  engineName,
  trimName,
  brandLogoUrl,
  imageUrl,
  selectedColors = [],
}: {
  brandName: string;
  modelName: string;
  engineName: string;
  trimName?: string;
  brandLogoUrl?: string | null;
  imageUrl?: string | null;
  selectedColors?: ListingColorChoice[];
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-card">
      <div className="flex items-center gap-3 px-5 pt-5">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-logo-circle">
          {brandLogoUrl ? (
            <Image
              src={brandLogoUrl}
              alt={brandName}
              width={26}
              height={26}
              unoptimized={shouldBypassImageOptimizer(brandLogoUrl)}
              className="h-[26px] w-[26px] object-contain"
            />
          ) : (
            <span className="text-xs font-bold">{brandName.slice(0, 2).toUpperCase()}</span>
          )}
        </span>
        <div className="min-w-0">
          <p className="text-heading-md leading-tight">
            {brandName} {modelName}
          </p>
          <p className="text-body-sm">
            {trimName ? `${trimName} · ` : ""}
            {engineName}
          </p>
        </div>
      </div>

      <RemoteImage
        src={imageUrl}
        alt={`${brandName} ${modelName}`}
        wrapperClassName="mt-3 aspect-[16/10] w-full bg-card"
        sizes="(max-width: 768px) 100vw, 600px"
      />

      {selectedColors.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-5 pb-5 pt-1">
          {selectedColors.map((c) => (
            <span
              key={c.id}
              className="inline-flex items-center gap-2 rounded-pill border border-line bg-paper px-3 py-1.5 text-xs font-medium"
            >
              <span
                className="h-3.5 w-3.5 rounded-full border border-line"
                style={{ backgroundColor: c.hex.startsWith("#") ? c.hex : `#${c.hex}` }}
              />
              {c.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
