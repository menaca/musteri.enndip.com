import { ShimmerBox } from "@/components/ui/shimmer";

/** Sidebar kullanıcı başlığı iskeleti — kimlik stream edilirken. */
export function SidebarIdentitySkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 rounded-2xl p-2">
        <ShimmerBox rounded="rounded-full" className="h-12 w-12 shrink-0" />
        <div className="flex flex-1 flex-col gap-2">
          <ShimmerBox rounded="rounded-md" className="h-4 w-32" />
          <ShimmerBox rounded="rounded-md" className="h-3 w-40" />
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <ShimmerBox key={i} rounded="rounded-xl" className="h-11 w-full" />
        ))}
      </div>
    </div>
  );
}
