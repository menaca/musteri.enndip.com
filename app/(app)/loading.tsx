import { ShimmerBox } from "@/components/ui/shimmer";

/** Home/genel iskelet — kasma hissi olmaması için anında gösterilir. */
export default function AppLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-6 lg:px-10 lg:py-10">
      <div className="flex flex-col gap-10">
        {/* Brand strip */}
        <div className="flex gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ShimmerBox key={i} rounded="rounded-full" className="h-16 w-16" />
          ))}
        </div>

        {/* Active listings */}
        <div>
          <ShimmerBox rounded="rounded-md" className="mb-4 h-6 w-40" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ShimmerBox key={i} rounded="rounded-3xl" className="aspect-[16/12]" />
            ))}
          </div>
        </div>

        {/* CTA */}
        <ShimmerBox rounded="rounded-3xl" className="h-40 w-full" />

        {/* Categories */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ShimmerBox key={i} rounded="rounded-3xl" className="aspect-[16/10]" />
          ))}
        </div>
      </div>
    </div>
  );
}
