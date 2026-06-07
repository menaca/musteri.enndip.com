import type { QueryClient } from "@tanstack/react-query";
import { bffFetch } from "@/lib/bff/client-fetch";
import { BffRoutes } from "@/lib/bff/routes";
import type { HomeFeedDto, ListingDto, UserProfileDto, BrandDto, CarSeriesDto } from "@/lib/api/types";
import { queryKeys } from "./keys";
import { STALE_TIMES } from "./stale-times";

export interface BffSession {
  isAuthed: boolean;
  isGuest: boolean;
}

export async function fetchBffSession(): Promise<BffSession> {
  return bffFetch<BffSession>(BffRoutes.session);
}

/** Sidebar mount / idle — ana sekmeleri önceden yükle. */
export async function prefetchPrimaryNav(
  queryClient: QueryClient,
  session: BffSession,
): Promise<void> {
  const tasks: Promise<void>[] = [
    queryClient.prefetchQuery({
      queryKey: queryKeys.home,
      queryFn: () => bffFetch<HomeFeedDto>(BffRoutes.home),
      staleTime: STALE_TIMES.home,
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.brands(),
      queryFn: () => bffFetch<BrandDto[]>(BffRoutes.brands()),
      staleTime: STALE_TIMES.brands,
    }),
  ];

  if (session.isAuthed) {
    tasks.push(
      queryClient.prefetchQuery({
        queryKey: queryKeys.listings,
        queryFn: () => bffFetch<ListingDto[]>(BffRoutes.listings),
        staleTime: STALE_TIMES.listings,
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.profile,
        queryFn: () => bffFetch<UserProfileDto>(BffRoutes.profile),
        staleTime: STALE_TIMES.profile,
      }),
    );
  }

  await Promise.allSettled(tasks);
}

export function prefetchForHref(
  queryClient: QueryClient,
  href: string,
  session: BffSession,
): void {
  if (href === "/" || href === "") {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.home,
      queryFn: () => bffFetch<HomeFeedDto>(BffRoutes.home),
      staleTime: STALE_TIMES.home,
    });
    return;
  }
  if (href === "/my-listings" && session.isAuthed) {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.listings,
      queryFn: () => bffFetch<ListingDto[]>(BffRoutes.listings),
      staleTime: STALE_TIMES.listings,
    });
    return;
  }
  if (href === "/account" && session.isAuthed) {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.profile,
      queryFn: () => bffFetch<UserProfileDto>(BffRoutes.profile),
      staleTime: STALE_TIMES.profile,
    });
    return;
  }
  if (href === "/find-car" || href.startsWith("/find-car")) {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.brands(),
      queryFn: () => bffFetch<BrandDto[]>(BffRoutes.brands()),
      staleTime: STALE_TIMES.brands,
    });
    return;
  }
}

export function prefetchSeries(
  queryClient: QueryClient,
  brandId: string,
  category?: string,
): void {
  void queryClient.prefetchQuery({
    queryKey: queryKeys.series(brandId, category),
    queryFn: () => bffFetch<CarSeriesDto[]>(BffRoutes.series(brandId, category)),
    staleTime: STALE_TIMES.series,
  });
}
