import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SettingsGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-[0.14em] text-muted">
        {title}
      </h2>
      <div className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-paper">
        {children}
      </div>
    </section>
  );
}

export function SettingsTile({
  title,
  subtitle,
  leading,
  trailing,
  href,
  onClick,
}: {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  const inner = (
    <div className="flex items-center gap-3 px-5 py-4">
      {leading && <span className="text-ink-900">{leading}</span>}
      <div className="min-w-0 flex-1">
        <p className="text-heading-sm">{title}</p>
        {subtitle && <p className="mt-0.5 text-body-sm">{subtitle}</p>}
      </div>
      {trailing}
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block transition-colors hover:bg-cream"
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {inner}
      </a>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn("block w-full text-left transition-colors hover:bg-cream")}>
        {inner}
      </button>
    );
  }
  return inner;
}
