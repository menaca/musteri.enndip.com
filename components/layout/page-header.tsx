import type { ReactNode } from "react";
import { BackBar } from "./back-bar";
import { cn } from "@/lib/utils";

/** İkincil sayfa başlığı: geri + başlık + opsiyonel aksiyon. */
export function PageHeader({
  title,
  subtitle,
  showBack = true,
  backFallbackHref,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backFallbackHref?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-6", className)}>
      {showBack && (
        <div className="mb-4">
          <BackBar fallbackHref={backFallbackHref ?? "/"} />
        </div>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-display-md">{title}</h1>
          {subtitle && <p className="mt-1.5 text-body-md text-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}
