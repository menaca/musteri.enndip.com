"use client";

import { useQuery } from "@tanstack/react-query";
import { bffFetch } from "@/lib/bff/client-fetch";
import { BffRoutes } from "@/lib/bff/routes";
import type {
  HomeFeedDto,
  ListingDto,
  UserProfileDto,
  BrandDto,
  CarSeriesDto,
} from "@/lib/api/types";
import { queryKeys } from "./keys";
import { STALE_TIMES } from "./stale-times";
import { fetchBffSession } from "./prefetch";

export function useBffSession() {
  return useQuery({
    queryKey: queryKeys.session,
    queryFn: fetchBffSession,
    staleTime: STALE_TIMES.session,
  });
}

export function useHomeFeed() {
  return useQuery({
    queryKey: queryKeys.home,
    queryFn: () => bffFetch<HomeFeedDto>(BffRoutes.home),
    staleTime: STALE_TIMES.home,
  });
}

export function useMyListings() {
  return useQuery({
    queryKey: queryKeys.listings,
    queryFn: () => bffFetch<ListingDto[]>(BffRoutes.listings),
    staleTime: STALE_TIMES.listings,
    retry: (count, err) => {
      if ("status" in err && (err as { status: number }).status === 401) return false;
      return count < 1;
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: () => bffFetch<UserProfileDto>(BffRoutes.profile),
    staleTime: STALE_TIMES.profile,
    retry: (count, err) => {
      if ("status" in err && (err as { status: number }).status === 401) return false;
      return count < 1;
    },
  });
}

export function useBrands(category?: string) {
  return useQuery({
    queryKey: queryKeys.brands(category),
    queryFn: () => bffFetch<BrandDto[]>(BffRoutes.brands(category)),
    staleTime: STALE_TIMES.brands,
  });
}

export function useSeries(brandId: string | null | undefined, category?: string) {
  return useQuery({
    queryKey: queryKeys.series(brandId ?? "", category),
    queryFn: () => bffFetch<CarSeriesDto[]>(BffRoutes.series(brandId!, category)),
    enabled: Boolean(brandId),
    staleTime: STALE_TIMES.series,
  });
}
