"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { prefetchForHref } from "@/lib/query/prefetch";
import { fetchBffSession } from "@/lib/query/prefetch";
import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/utils";

/** Sidebar link — hover/focus'ta BFF verisini önceden yükler. */
export function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  active: boolean;
  onNavigate?: () => void;
}) {
  const queryClient = useQueryClient();

  function onIntent() {
    void fetchBffSession()
      .then((session) => prefetchForHref(queryClient, href, session))
      .catch(() => {});
  }

  return (
    <Link
      href={href}
      onClick={onNavigate}
      onMouseEnter={onIntent}
      onFocus={onIntent}
      className={cn(
        "flex items-center gap-3.5 rounded-xl px-3 py-3 text-[0.95rem] font-semibold transition-colors",
        active ? "bg-ink-900 text-paper" : "text-ink-900 hover:bg-cream",
      )}
    >
      <Icon size={22} className={active ? "text-paper" : "text-ink-900"} />
      {label}
    </Link>
  );
}
