import Link from "next/link";
import { SectionHeader } from "@/components/ui/section-header";
import { RemoteImage } from "@/components/ui/remote-image";
import { SearchIcon } from "@/components/ui/icons";
import type { VehicleCategoryDto } from "@/lib/api/types";
import { Routes } from "@/lib/routes";

function CategoryCard({ category }: { category: VehicleCategoryDto }) {
  return (
    <Link
      href={`${Routes.findCar}?category=${encodeURIComponent(category.slug)}`}
      className="group relative block aspect-[16/10] overflow-hidden rounded-3xl bg-card"
    >
      <RemoteImage
        src={category.imageUrl}
        alt={category.name}
        wrapperClassName="absolute inset-0 size-full"
        sizes="(max-width: 768px) 50vw, 25vw"
        className="transition-transform duration-500 group-hover:scale-105"
      />
      <span className="absolute left-4 top-4 text-heading-sm text-ink-900">
        {category.name}
      </span>
    </Link>
  );
}

export function CategoryGrid({
  categories,
}: {
  categories: VehicleCategoryDto[];
}) {
  return (
    <section>
      <SectionHeader title="Ne tür bir araç arıyorsun?" />
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((c) => (
          <CategoryCard key={c.id} category={c} />
        ))}
        {/* "Ne aradığını bilmiyor musun?" — Araç Bul */}
        <Link
          href={Routes.findCar}
          className="flex aspect-[16/10] flex-col items-start justify-between rounded-3xl bg-ink-900 p-4 text-paper transition-transform hover:scale-[1.02]"
        >
          <span className="text-heading-sm text-paper">
            Ne aradığını bilmiyor musun?
          </span>
          <span className="inline-flex items-center gap-2 rounded-pill bg-paper px-4 py-2 text-sm font-semibold text-ink-900">
            <SearchIcon size={16} /> Aracını Bulalım
          </span>
        </Link>
      </div>
    </section>
  );
}
