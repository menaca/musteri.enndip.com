"use client";

import { useState } from "react";
import { RemoteImage } from "@/components/ui/remote-image";
import { AppButton } from "@/components/ui/app-button";
import { CloseIcon, BoltIcon } from "@/components/ui/icons";
import { useToast } from "@/components/ui/toast";
import { formatTry } from "@/lib/format";
import { CarIcon } from "@/components/ui/icons";

interface ReadyVehicle {
  id: string;
  brandName: string;
  modelName: string;
  trimLabel: string;
  priceTry: number;
  badgeLabel: string;
  city?: string;
  imageUrl: string;
}

// Örnek hazır fiyatlı araçlar (mobille aynı). Görseller canlı katalog gelince dolar.
const SAMPLE: ReadyVehicle[] = [
  { id: "demo-tcross", brandName: "Volkswagen", modelName: "T-Cross", trimLabel: "1.0 TSI Style", priceTry: 1185000, badgeLabel: "Hemen teslim", imageUrl: "" },
  { id: "demo-yaris", brandName: "Toyota", modelName: "Yaris", trimLabel: "1.5 Hybrid Dream", priceTry: 985000, badgeLabel: "Stokta", city: "Ankara", imageUrl: "" },
  { id: "demo-clio", brandName: "Renault", modelName: "Clio", trimLabel: "1.0 TCe Evolution", priceTry: 875000, badgeLabel: "Fırsat", city: "İzmir", imageUrl: "" },
  { id: "demo-a3", brandName: "Audi", modelName: "A3", trimLabel: "Sportback 35 TFSI", priceTry: 1645000, badgeLabel: "Hemen teslim", imageUrl: "" },
  { id: "demo-q2", brandName: "Audi", modelName: "Q2", trimLabel: "35 TFSI Advanced", priceTry: 1525000, badgeLabel: "Stokta", city: "Bursa", imageUrl: "" },
];

export function BuyFromEnndipView() {
  const { show } = useToast();
  const [active, setActive] = useState<ReadyVehicle | null>(null);

  return (
    <>
      <div className="mb-6 flex items-start gap-3 rounded-2xl bg-cream p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink-900 text-paper">
          <BoltIcon size={22} />
        </span>
        <div>
          <p className="text-heading-sm">{SAMPLE.length} hazır fiyatlı araç</p>
          <p className="mt-0.5 text-body-sm">
            İlan süresi dolmuş veya bayinin hızlı satmak istediği stok araçlar. Teklif
            beklemeden doğrudan al.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {SAMPLE.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setActive(v)}
            className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-card text-left transition-shadow hover:shadow-card"
          >
            <RemoteImage
              src={v.imageUrl}
              alt={`${v.brandName} ${v.modelName}`}
              wrapperClassName="aspect-[16/11] w-full"
              fallback={<CarIcon size={40} />}
              sizes="(max-width: 768px) 50vw, 280px"
            />
            <div className="flex flex-col gap-1 p-4">
              <p className="text-heading-sm leading-tight">
                {v.brandName} {v.modelName}
              </p>
              <p className="text-body-sm">{v.trimLabel}</p>
              <p className="mt-1 text-heading-sm">{formatTry(v.priceTry)}</p>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center">
          <button
            type="button"
            aria-label="Kapat"
            onClick={() => setActive(null)}
            className="absolute inset-0 bg-ink-900/40 animate-fade-in"
          />
          <div className="relative w-full max-w-lg animate-slide-up-sheet rounded-t-3xl bg-paper p-6 shadow-float sm:rounded-3xl">
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Kapat"
              className="absolute right-4 top-4 rounded-full p-1.5 text-ink-900 hover:bg-cream"
            >
              <CloseIcon size={22} />
            </button>
            <RemoteImage
              src={active.imageUrl}
              alt={`${active.brandName} ${active.modelName}`}
              wrapperClassName="aspect-[16/9] w-full rounded-2xl"
              fallback={<CarIcon size={48} />}
            />
            <h2 className="mt-4 text-heading-lg">
              {active.brandName} {active.modelName}
            </h2>
            <p className="mt-0.5 text-body-md text-muted">{active.trimLabel}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-display-md">{formatTry(active.priceTry)}</span>
              <span className="rounded-pill bg-accent/12 px-3 py-1.5 text-xs font-bold text-accent">
                {active.badgeLabel}
              </span>
            </div>
            <p className="mt-3 text-body-md text-muted">
              Bu araç bayi stokundan hazır fiyatla sunulmaktadır. Ödeme ve teslimat
              adımları yakında uygulama içinde tamamlanabilecek.
            </p>
            <AppButton
              fullWidth
              className="mt-6"
              onClick={() => {
                show(`${active.brandName} ${active.modelName} için satın alma akışı yakında.`);
                setActive(null);
              }}
            >
              Satın al
            </AppButton>
          </div>
        </div>
      )}
    </>
  );
}
