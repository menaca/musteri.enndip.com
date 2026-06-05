import { cn } from "@/lib/utils";

/** Tek bir iskelet bloğu (Flutter ShimmerBox karşılığı). */
export function ShimmerBox({
  className,
  rounded = "rounded-xl",
}: {
  className?: string;
  rounded?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-sand shimmer",
        rounded,
        className,
      )}
    />
  );
}

/** Çok satırlı metin iskeleti. */
export function ShimmerLines({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <ShimmerBox
          key={i}
          rounded="rounded-md"
          className={cn("h-3.5", i === lines - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
}
