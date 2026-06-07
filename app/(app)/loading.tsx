import { HomePageSkeleton } from "@/components/skeletons/pages";

/** Yalnızca anasayfa (/) — alt rotalar kendi loading.tsx dosyalarını kullanır. */
export default function HomeLoading() {
  return <HomePageSkeleton />;
}
