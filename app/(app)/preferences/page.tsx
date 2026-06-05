import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { PreferencesView } from "@/components/settings/preferences-view";

export const metadata: Metadata = { title: "Tercihler" };

export default function PreferencesPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-6 sm:px-6 lg:px-10 lg:py-10">
      <PageHeader
        title="Tercihler"
        subtitle="İletişim, fiyat ve bildirim ayarlarını yönet."
      />
      <PreferencesView />
    </div>
  );
}
