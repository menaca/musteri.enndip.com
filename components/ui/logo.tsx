import { cn } from "@/lib/utils";

/** enndip kelime markası. Mobil header'daki "enndip.com" ile aynı. */
export function Logo({
  className,
  withDomain = true,
  light = false,
}: {
  className?: string;
  withDomain?: boolean;
  /** Koyu zemin (auth sol panel vb.) */
  light?: boolean;
}) {
  return (
    <span
      className={cn(
        "select-none font-extrabold tracking-tight",
        light ? "text-paper" : "text-ink-900",
        className,
      )}
    >
      enndip
      {withDomain && (
        <span className={light ? "text-paper/55" : "text-muted"}>.com</span>
      )}
    </span>
  );
}
