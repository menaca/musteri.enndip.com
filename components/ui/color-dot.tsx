import { toDisplayHex } from "@/lib/color";
import { cn } from "@/lib/utils";

/** Gövde rengi swatch — API hex'i # olmadan gelse bile CSS'e uygun döner. */
export function ColorDot({
  hex,
  className,
  title,
}: {
  hex?: string | null;
  className?: string;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={cn("inline-block shrink-0 rounded-full border border-line", className)}
      style={{ backgroundColor: toDisplayHex(hex) }}
    />
  );
}
