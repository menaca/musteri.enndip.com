import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { CarIcon, TuneIcon, ReceiptIcon, CheckIcon } from "@/components/ui/icons";
import { Routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Nasıl Çalışır?" };

const STEPS = [
  {
    icon: CarIcon,
    title: "Aracını seç",
    description:
      "Marka, seri, paket ve motor adımlarında istediğin sıfır aracı belirle.",
  },
  {
    icon: TuneIcon,
    title: "Detayları tamamla",
    description:
      "Teknik özellikleri incele, renk tercihlerini seç ve ilan özetini onayla.",
  },
  {
    icon: ReceiptIcon,
    title: "Teklifleri topla",
    description:
      "Yetkili bayiler ilanına teklif verir; en düşük teklifi sen seçersin.",
  },
  {
    icon: CheckIcon,
    title: "Güvenle satın al",
    description:
      "Seçtiğin bayi ile süreci tamamla; sıfır araçta şeffaf fiyatlandırma.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-6 sm:px-6 lg:px-10 lg:py-10">
      <PageHeader
        title="Nasıl Çalışır?"
        subtitle="enndip ile sıfır araç alımında tersine açık artırma modeli."
      />

      <ol className="flex flex-col gap-3">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <li
              key={step.title}
              className="flex items-start gap-4 rounded-3xl border border-line bg-card p-5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink-900 text-paper">
                <Icon size={22} className="text-paper" />
              </span>
              <div>
                <p className="text-heading-sm">
                  {i + 1}. {step.title}
                </p>
                <p className="mt-1 text-body-md text-muted">{step.description}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <Link href={Routes.findCar} className="btn-primary mt-8 w-full">
        İlan Oluştur
      </Link>
    </div>
  );
}
