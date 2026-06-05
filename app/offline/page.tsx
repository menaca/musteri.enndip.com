import type { Metadata } from "next";
import { Logo } from "@/components/ui/logo";

export const metadata: Metadata = {
  title: "Çevrimdışısınız",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-paper px-6 text-center">
      <Logo />
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-ink">İnternet bağlantısı yok</h1>
        <p className="max-w-sm text-muted">
          Görünüşe göre çevrimdışısınız. Bağlantınızı kontrol edip tekrar deneyin.
        </p>
      </div>
    </main>
  );
}
