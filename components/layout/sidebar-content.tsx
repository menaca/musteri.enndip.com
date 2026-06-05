"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Logo } from "@/components/ui/logo";
import { LogoutIcon } from "@/components/ui/icons";
import { PRIMARY_NAV, FOOTER_NAV, isNavItemActive } from "./nav-items";
import { signOutAction } from "@/lib/actions/auth";
import { Routes } from "@/lib/routes";
import type { SessionIdentity } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

/** Drawer/sidebar içeriği — mobil app_drawer.dart ile aynı yapı. */
export function SidebarContent({
  identity,
  onNavigate,
}: {
  identity: SessionIdentity;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <Link
        href={identity.isAuthed ? Routes.account : Routes.login}
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-cream"
      >
        <Avatar name={identity.displayName} src={identity.avatarUrl} size={48} />
        <div className="min-w-0">
          <p className="truncate text-heading-sm">{identity.displayName}</p>
          {identity.email && (
            <p className="truncate text-body-sm">{identity.email}</p>
          )}
        </div>
      </Link>

      {/* Primary nav */}
      <nav className="mt-6 flex flex-col gap-1">
        {PRIMARY_NAV.map((item) => {
          const active = isNavItemActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3.5 rounded-xl px-3 py-3 text-[0.95rem] font-semibold transition-colors",
                active
                  ? "bg-ink-900 text-paper"
                  : "text-ink-900 hover:bg-cream",
              )}
            >
              <Icon size={22} className={active ? "text-paper" : "text-ink-900"} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6">
        <Logo className="text-lg" />
        <div className="mt-3 flex flex-col gap-2">
          {FOOTER_NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className="text-body-md text-muted transition-colors hover:text-ink-900"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="mt-4 border-t border-line pt-4">
          {identity.isAuthed ? (
            <form action={signOutAction}>
              <button
                type="submit"
                className="flex items-center gap-3 text-[0.95rem] font-semibold text-ink-900 transition-colors hover:text-danger"
              >
                <LogoutIcon size={22} />
                Çıkış Yap
              </button>
            </form>
          ) : (
            <Link
              href={Routes.login}
              onClick={onNavigate}
              className="flex items-center gap-3 text-[0.95rem] font-semibold text-ink-900 transition-colors hover:text-accent"
            >
              <LogoutIcon size={22} className="rotate-180" />
              Giriş Yap
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
