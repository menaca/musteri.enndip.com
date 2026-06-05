import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-line bg-cream px-6 py-14 text-center",
        className,
      )}
    >
      {icon && <div className="mb-4 text-muted-soft">{icon}</div>}
      <h3 className="text-heading-md">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-body-md text-muted">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
