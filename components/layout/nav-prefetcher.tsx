"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { fetchBffSession, prefetchPrimaryNav } from "@/lib/query/prefetch";

/** Uygulama açılışında ana sekmeleri idle'da önceden yükler. */
export function NavPrefetcher() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let cancelled = false;

    const run = () => {
      void fetchBffSession()
        .then((session) => {
          if (!cancelled) return prefetchPrimaryNav(queryClient, session);
        })
        .catch(() => {
          // Sessiz — prefetch asla UX'i bozmaz.
        });
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(run, { timeout: 2500 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const t = setTimeout(run, 400);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [queryClient]);

  return null;
}
