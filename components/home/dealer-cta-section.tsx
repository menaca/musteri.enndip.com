import Link from "next/link";
import { Routes } from "@/lib/routes";

/** "En düşük teklifi almak ister misin?" CTA bloğu. */
export function DealerCtaSection() {
  return (
    <section className="rounded-3xl bg-cream px-6 py-10 text-center sm:px-10">
      <h2 className="mx-auto max-w-xl text-display-md text-balance">
        Aradığın sıfır araç için en düşük teklifi almak ister misin?
      </h2>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href={Routes.howItWorks} className="btn-ghost w-full sm:w-auto">
          Nasıl Çalışır?
        </Link>
        <Link href={Routes.findCar} className="btn-primary w-full sm:w-auto">
          İlan Oluştur
        </Link>
      </div>
    </section>
  );
}
