import { BrandStrip } from "@/components/home/brand-strip";
import { ActiveListingsSection } from "@/components/home/active-listings-section";
import { DealerCtaSection } from "@/components/home/dealer-cta-section";
import { AdSlider } from "@/components/home/ad-slider";
import { CategoryGrid } from "@/components/home/category-grid";
import { getHomeFeed } from "@/lib/api/queries";
import type { HomeFeedDto } from "@/lib/api/types";

const EMPTY_FEED: HomeFeedDto = {
  featuredBrands: [],
  activeListings: [],
  ads: [],
  categories: [],
};

export default async function HomePage() {
  let feed = EMPTY_FEED;
  try {
    feed = await getHomeFeed();
  } catch {
    feed = EMPTY_FEED;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-6 lg:px-10 lg:py-10">
      <div className="flex flex-col gap-10">
        {feed.featuredBrands.length > 0 && (
          <BrandStrip brands={feed.featuredBrands} />
        )}

        <ActiveListingsSection listings={feed.activeListings} />

        <DealerCtaSection />

        {feed.ads.length > 0 && <AdSlider ads={feed.ads} />}

        {feed.categories.length > 0 && (
          <CategoryGrid categories={feed.categories} />
        )}
      </div>
    </div>
  );
}
