import { Suspense, type ReactNode } from "react";
import { ShellChrome } from "./shell-chrome";
import { SidebarIdentity } from "./sidebar-identity";
import { SidebarIdentitySkeleton } from "./sidebar-identity-skeleton";

/**
 * (app) grubu kabuğu — sayfa içeriği auth beklenmeden stream edilir;
 * sidebar kimliği ayrı Suspense boundary'de yüklenir.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const sidebar = (
    <Suspense fallback={<SidebarIdentitySkeleton />}>
      <SidebarIdentity />
    </Suspense>
  );

  return (
    <ShellChrome sidebar={sidebar}>
      {children}
    </ShellChrome>
  );
}
