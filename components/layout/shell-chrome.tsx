"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { MenuIcon, CloseIcon } from "@/components/ui/icons";
import { Routes } from "@/lib/routes";

/**
 * Responsive kabuk:
 * - lg+ : kalıcı sol sidebar
 * - lg- : üstte hamburger + açılır drawer (mobil sidebar.png davranışı)
 */
export function ShellChrome({
  sidebar,
  children,
}: {
  /** Suspense ile stream edilen sidebar (kimlik + nav). */
  sidebar: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Rota değişince drawer'ı kapat.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Drawer açıkken body scroll kilidi.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[300px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh border-r border-line bg-paper p-5 lg:block">
        {sidebar}
      </aside>

      <div className="flex min-h-dvh flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-paper/95 px-4 py-3 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Menüyü aç"
            className="rounded-lg p-1.5 text-ink-900 hover:bg-cream"
          >
            <MenuIcon size={26} />
          </button>
          <Link href={Routes.home} aria-label="Ana sayfa">
            <Logo className="text-lg" />
          </Link>
          <span className="w-9" />
        </header>

        <main className="flex-1">{children}</main>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Menüyü kapat"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink-900/40 animate-fade-in"
          />
          <div className="absolute inset-y-0 left-0 w-[84%] max-w-[340px] animate-slide-in-left bg-paper p-5 shadow-drawer">
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Kapat"
                className="rounded-lg p-1.5 text-ink-900 hover:bg-cream"
              >
                <CloseIcon size={24} />
              </button>
            </div>
            {sidebar}
          </div>
        </div>
      )}
    </div>
  );
}
