import Link from "next/link";
import { cn } from "@/lib/utils";

/** "Aktif İlanlarım ... Tümünü Gör" gibi bölüm başlığı (Flutter SectionHeader). */
export function SectionHeader({
  title,
  actionLabel,
  actionHref,
  onAction,
  className,
}: {
  title: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-baseline justify-between gap-3", className)}>
      <h2 className="text-heading-lg">{title}</h2>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="shrink-0 text-body-sm font-semibold text-ink-900 hover:underline"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && !actionHref && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 text-body-sm font-semibold text-ink-900 hover:underline"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
