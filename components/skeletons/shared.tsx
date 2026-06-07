import type { ReactNode } from "react";
import { ShimmerBox } from "@/components/ui/shimmer";
import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className,
  maxWidth = "max-w-6xl",
}: {
  children: ReactNode;
  className?: string;
  maxWidth?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 py-6 sm:px-6 lg:px-10 lg:py-10",
        maxWidth,
        className,
      )}
    >
      {children}
    </div>
  );
}

export function BackBarSkeleton() {
  return <ShimmerBox rounded="rounded-md" className="h-5 w-16" />;
}

export function PageHeaderSkeleton({
  showAction = false,
  subtitle = true,
}: {
  showAction?: boolean;
  subtitle?: boolean;
}) {
  return (
    <div className="mb-6">
      <div className="mb-4">
        <BackBarSkeleton />
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <ShimmerBox rounded="rounded-md" className="h-8 w-48" />
          {subtitle && <ShimmerBox rounded="rounded-md" className="h-4 w-64 max-w-full" />}
        </div>
        {showAction && <ShimmerBox rounded="rounded-pill" className="hidden h-10 w-28 sm:block" />}
      </div>
    </div>
  );
}

export function FilterChipsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="mb-6 flex gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <ShimmerBox key={i} rounded="rounded-pill" className="h-9 w-20" />
      ))}
    </div>
  );
}

export function ListRowsSkeleton({
  count = 7,
  showLeading = true,
}: {
  count?: number;
  showLeading?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-2xl px-3 py-3.5">
          {showLeading && <ShimmerBox rounded="rounded-full" className="h-9 w-9 shrink-0" />}
          <div className="flex flex-1 flex-col gap-1.5">
            <ShimmerBox rounded="rounded-md" className="h-4 w-3/5" />
            {i % 3 === 0 && <ShimmerBox rounded="rounded-md" className="h-3 w-1/3" />}
          </div>
          <ShimmerBox rounded="rounded-md" className="h-4 w-4 shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function SettingsGroupSkeleton({
  titleWidth = "w-24",
  tiles = 3,
}: {
  titleWidth?: string;
  tiles?: number;
}) {
  return (
    <div className="space-y-2">
      <ShimmerBox rounded="rounded-md" className={cn("h-3.5", titleWidth)} />
      <div className="overflow-hidden rounded-3xl border border-line bg-card">
        {Array.from({ length: tiles }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-4 px-4 py-4",
              i < tiles - 1 && "border-b border-line",
            )}
          >
            <ShimmerBox rounded="rounded-xl" className="h-10 w-10 shrink-0" />
            <div className="flex flex-1 flex-col gap-1.5">
              <ShimmerBox rounded="rounded-md" className="h-4 w-28" />
              <ShimmerBox rounded="rounded-md" className="h-3 w-40" />
            </div>
            <ShimmerBox rounded="rounded-md" className="h-4 w-4 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function VehicleShowcaseCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-card">
      <div className="flex items-center gap-3 px-5 pt-5">
        <ShimmerBox rounded="rounded-full" className="h-11 w-11 shrink-0" />
        <div className="flex flex-1 flex-col gap-2">
          <ShimmerBox rounded="rounded-md" className="h-5 w-48" />
          <ShimmerBox rounded="rounded-md" className="h-3.5 w-36" />
        </div>
      </div>
      <ShimmerBox rounded="rounded-none" className="mt-3 aspect-[16/10] w-full" />
      <div className="flex gap-2 px-5 py-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <ShimmerBox key={i} rounded="rounded-pill" className="h-7 w-20" />
        ))}
      </div>
    </div>
  );
}
