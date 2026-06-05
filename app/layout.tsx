import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { AnalyticsTracker } from "@/components/analytics/analytics-tracker";
import { ServiceWorkerRegister } from "@/components/pwa/sw-register";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-jakarta",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://musteri.enndip.com";
const TITLE = "enndip | Sıfır araçta en uygun fiyat";
const DESCRIPTION =
  "Sıfır araç için ilanını oluştur, yetkili bayiler en uygun teklifi sunsun. " +
  "Dakikalar içinde enndip fiyatını öğren.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "enndip",
  title: {
    default: TITLE,
    template: "%s · enndip",
  },
  description: DESCRIPTION,
  keywords: [
    "sıfır araç",
    "araç fiyatı",
    "tersine açık artırma",
    "yetkili bayi",
    "araba teklifi",
    "enndip",
  ],
  authors: [{ name: "enndip" }],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "enndip",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    siteName: "enndip",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={jakarta.variable} suppressHydrationWarning>
      {/* suppressHydrationWarning: tarayıcı eklentileri (cz-shortcut-listen vb.) body'ye attribute ekler */}
      <body suppressHydrationWarning>
        <ToastProvider>{children}</ToastProvider>
        <AnalyticsTracker />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
