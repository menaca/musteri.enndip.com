"use client";

import { BrandStrip } from "@/components/home/brand-strip";
import { ActiveListingsSection } from "@/components/home/active-listings-section";
import { DealerCtaSection } from "@/components/home/dealer-cta-section";
import { AdSlider } from "@/components/home/ad-slider";
import { CategoryGrid } from "@/components/home/category-grid";
import { HomePageSkeleton } from "@/components/skeletons/pages";
import { useHomeFeed } from "@/lib/query/hooks";
import type { HomeFeedDto } from "@/lib/api/types";

const EMPTY_FEED: HomeFeedDto = {
  featuredBrands: [],
  activeListings: [],
  ads: [],
  categories: [],
};

export function HomePageClient() {
  const { data, isLoading, isFetching, error } = useHomeFeed();
  const feed = data ?? EMPTY_FEED;

  if (isLoading && data === undefined) {
    return <HomePageSkeleton />;
  }

  const showRefresh = isFetching && !isLoading;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-6 lg:px-10 lg:py-10">
      {error && (
        <p className="mb-4 rounded-2xl border border-danger/30 bg-danger/10 p-4 text-body-md text-danger">
          {error instanceof Error ? error.message : "Ana sayfa yüklenemedi."}
        </p>
      )}
      <div
        className={`flex flex-col gap-10 transition-opacity ${showRefresh ? "opacity-90" : ""}`}
      >
        {feed.featuredBrands.length > 0 && <BrandStrip brands={feed.featuredBrands} />}
        <ActiveListingsSection listings={feed.activeListings} />
        <DealerCtaSection />
        {feed.ads.length > 0 && <AdSlider ads={feed.ads} />}
        {feed.categories.length > 0 && <CategoryGrid categories={feed.categories} />}
      </div>
    </div>
  );
}
