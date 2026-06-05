import Link from "next/link";
import Image from "next/image";
import type { BrandDto } from "@/lib/api/types";
import { shouldBypassImageOptimizer } from "@/lib/image";
import { Routes } from "@/lib/routes";

/** Yatay marka şeridi — tıkla → find-car (marka önseçili). */
export function BrandStrip({ brands }: { brands: BrandDto[] }) {
  if (!brands.length) return null;
  return (
    <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0 lg:flex-wrap lg:overflow-visible">
      {brands.map((brand) => (
        <Link
          key={brand.id}
          href={`${Routes.findCar}?brand=${brand.id}`}
          className="group flex shrink-0 flex-col items-center gap-2"
          title={brand.name}
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-logo-circle transition-transform group-hover:scale-105">
            {brand.logoUrl ? (
              <Image
                src={brand.logoUrl}
                alt={brand.name}
                width={36}
                height={36}
                unoptimized={shouldBypassImageOptimizer(brand.logoUrl)}
                className="h-9 w-9 object-contain"
              />
            ) : (
              <span className="text-xs font-bold text-ink-900">
                {brand.name.slice(0, 3).toUpperCase()}
              </span>
            )}
          </span>
          <span className="max-w-[64px] truncate text-center text-xs font-medium text-muted">
            {brand.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
