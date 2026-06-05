import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { NotificationsView } from "@/components/settings/notifications-view";

export const metadata: Metadata = { title: "Bildirimler" };

export default function NotificationsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-6 sm:px-6 lg:px-10 lg:py-10">
      <PageHeader
        title="Bildirimler"
        subtitle="Uygulama bildirimlerin ve güncellemeler."
      />
      <NotificationsView />
    </div>
  );
}
