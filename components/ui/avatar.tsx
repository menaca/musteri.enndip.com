import Image from "next/image";
import { cn } from "@/lib/utils";
import { initialsOf } from "@/lib/format";

export function Avatar({
  name,
  src,
  size = 44,
  className,
}: {
  name?: string | null;
  src?: string | null;
  size?: number;
  className?: string;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name ?? "Avatar"}
        width={size}
        height={size}
        className={cn("rounded-full object-cover", className)}
      />
    );
  }
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-logo-circle text-sm font-bold text-ink-900",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {initialsOf(name)}
    </div>
  );
}
