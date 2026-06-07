import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { QueryProvider } from "@/components/providers/query-provider";

export default function AppGroupLayout({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AppShell>{children}</AppShell>
    </QueryProvider>
  );
}
