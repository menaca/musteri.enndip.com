"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GC_TIME } from "@/lib/query/stale-times";
import { NavPrefetcher } from "@/components/layout/nav-prefetcher";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            gcTime: GC_TIME,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      <NavPrefetcher />
      {children}
    </QueryClientProvider>
  );
}
