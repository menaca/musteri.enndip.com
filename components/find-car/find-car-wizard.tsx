"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { shouldBypassImageOptimizer } from "@/lib/image";
import { ShimmerBox } from "@/components/ui/shimmer";
import { ChevronRightIcon, AlertIcon } from "@/components/ui/icons";
import { useToast } from "@/components/ui/toast";
import { Routes } from "@/lib/routes";
import { selectionToQueryString } from "@/lib/listing/selection";
import type {
  BrandDto,
  CarSeriesDto,
  CarSeriesTrimDto,
  CarEngineDto,
} from "@/lib/api/types";
import { cn } from "@/lib/utils";

type Step = "brand" | "series" | "trim" | "engine";

const STEP_LABEL: Record<Step, string> = {
  brand: "Marka Seç",
  series: "Seri Seç",
  trim: "Paket Seç",
  engine: "Motor Seç",
};

export function FindCarWizard({
  brands,
  category,
  preselectedBrand,
  initialSeries,
}: {
  brands: BrandDto[];
  category?: string;
  preselectedBrand?: BrandDto | null;
  initialSeries?: CarSeriesDto[] | null;
}) {
  const router = useRouter();
  const { show } = useToast();

  const startAtSeries = !!preselectedBrand;
  const [step, setStep] = useState<Step>(startAtSeries ? "series" : "brand");
  const [brand, setBrand] = useState<BrandDto | null>(preselectedBrand ?? null);
  const [series, setSeries] = useState<CarSeriesDto | null>(null);
  const [trim, setTrim] = useState<CarSeriesTrimDto | null>(null);

  const [seriesList, setSeriesList] = useState<CarSeriesDto[]>(initialSeries ?? []);
  const [trimList, setTrimList] = useState<CarSeriesTrimDto[]>([]);
  const [engineList, setEngineList] = useState<CarEngineDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStep = useCallback(
    async (url: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url);
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as { message?: string } | null;
          throw new Error(body?.message ?? "Veri alınamadı.");
        }
        return (await res.json()) as unknown;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Bir hata oluştu.";
        setError(msg);
        show(msg, "error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [show],
  );

  const catParam = category ? `&category=${encodeURIComponent(category)}` : "";

  async function selectBrand(b: BrandDto) {
    setBrand(b);
    setSeries(null);
    setTrim(null);
    setTrimList([]);
    setEngineList([]);
    setStep("series");
    const data = await fetchStep(`/api/catalog/series?brandId=${b.id}${catParam}`);
    if (data) setSeriesList(data as CarSeriesDto[]);
  }

  async function selectSeries(s: CarSeriesDto) {
    setSeries(s);
    setTrim(null);
    setEngineList([]);
    setStep("trim");
    const data = await fetchStep(`/api/catalog/trims?seriesId=${s.id}${catParam}`);
    if (data) setTrimList(data as CarSeriesTrimDto[]);
  }

  async function selectTrim(t: CarSeriesTrimDto) {
    if (!series) return;
    setTrim(t);
    setStep("engine");
    const data = await fetchStep(
      `/api/catalog/engines?seriesId=${series.id}&trimId=${t.id}${catParam}`,
    );
    if (data) setEngineList(data as CarEngineDto[]);
  }

  function selectEngine(en: CarEngineDto) {
    if (!brand) return;
    const qs = selectionToQueryString({
      brandId: brand.id,
      brandName: brand.name,
      modelId: en.modelId,
      engineId: en.id,
      engineName: en.name,
      trimName: trim?.name,
      seriesName: series?.name,
      brandLogoUrl: brand.logoUrl ?? undefined,
      colorIds: [],
      offerFeeTry: 199,
    });
    router.push(`${Routes.listingVehicleOptions}?${qs}`);
  }

  function goBack() {
    if (step === "engine") {
      setStep("trim");
      setTrim(null);
      setEngineList([]);
    } else if (step === "trim") {
      setStep("series");
      setTrim(null);
      setTrimList([]);
    } else if (step === "series") {
      if (startAtSeries) {
        router.push(Routes.home);
      } else {
        setStep("brand");
        setBrand(null);
        setSeriesList([]);
      }
    } else {
      router.push(Routes.home);
    }
  }

  // Adım chip'leri (seçili olanları gösterir).
  const chips: { label: string; active: boolean }[] = [
    { label: brand?.name ?? STEP_LABEL.brand, active: step === "brand" },
    { label: series?.name ?? STEP_LABEL.series, active: step === "series" },
    { label: trim?.name ?? STEP_LABEL.trim, active: step === "trim" },
    { label: STEP_LABEL.engine, active: step === "engine" },
  ];

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-4">
        <button
          type="button"
          onClick={goBack}
          className="text-[0.95rem] font-semibold text-ink-900 hover:opacity-70"
        >
          ← Geri
        </button>
      </div>

      <h1 className="text-center text-display-md text-balance">
        Hangi araç için ilan oluşturmak istiyorsun?
      </h1>

      {/* Adım chip'leri */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {chips.map((c, i) => (
          <span
            key={i}
            className={cn(
              "rounded-pill border px-4 py-2 text-sm font-semibold",
              c.active
                ? "border-ink-900 bg-ink-900 text-paper"
                : "border-line bg-paper text-muted",
            )}
          >
            {c.label}
          </span>
        ))}
      </div>

      {/* Liste */}
      <div className="mt-6 rounded-3xl bg-cream p-2 sm:p-3">
        {loading ? (
          <ListSkeleton />
        ) : error ? (
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <AlertIcon className="text-danger" size={28} />
            <p className="text-body-md text-muted">{error}</p>
            <button
              type="button"
              onClick={() => retry()}
              className="btn-ghost"
            >
              Tekrar dene
            </button>
          </div>
        ) : (
          renderList()
        )}
      </div>
    </div>
  );

  function retry() {
    if (step === "series" && brand) void selectBrand(brand);
    else if (step === "trim" && series) void selectSeries(series);
    else if (step === "engine" && series && trim) void selectTrim(trim);
  }

  function renderList() {
    if (step === "brand") {
      return (
        <ItemList
          items={brands.map((b) => ({
            key: b.id,
            label: b.name,
            leading: <BrandLogo brand={b} />,
            onClick: () => selectBrand(b),
          }))}
          empty="Marka bulunamadı."
        />
      );
    }
    if (step === "series") {
      return (
        <ItemList
          items={seriesList.map((s) => ({
            key: s.id,
            label: s.name,
            onClick: () => selectSeries(s),
          }))}
          empty="Bu marka için seri bulunamadı."
        />
      );
    }
    if (step === "trim") {
      return (
        <ItemList
          items={trimList.map((t) => ({
            key: t.id,
            label: t.name,
            onClick: () => selectTrim(t),
          }))}
          empty="Bu seri için paket bulunamadı."
        />
      );
    }
    return (
      <ItemList
        items={engineList.map((en) => ({
          key: en.id,
          label: en.name,
          sublabel: en.fuelType ?? undefined,
          onClick: () => selectEngine(en),
        }))}
        empty="Bu paket için motor bulunamadı."
      />
    );
  }
}

function BrandLogo({ brand }: { brand: BrandDto }) {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-logo-circle">
      {brand.logoUrl ? (
        <Image
          src={brand.logoUrl}
          alt={brand.name}
          width={22}
          height={22}
          unoptimized={shouldBypassImageOptimizer(brand.logoUrl)}
          className="h-[22px] w-[22px] object-contain"
        />
      ) : (
        <span className="text-[10px] font-bold">{brand.name.slice(0, 2).toUpperCase()}</span>
      )}
    </span>
  );
}

type ListItem = {
  key: string;
  label: string;
  sublabel?: string;
  leading?: React.ReactNode;
  onClick: () => void;
};

function ItemList({ items, empty }: { items: ListItem[]; empty: string }) {
  if (!items.length) {
    return <p className="p-8 text-center text-body-md text-muted">{empty}</p>;
  }
  return (
    <ul className="flex flex-col">
      {items.map((it) => (
        <li key={it.key}>
          <button
            type="button"
            onClick={it.onClick}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-3.5 text-left transition-colors hover:bg-paper"
          >
            {it.leading}
            <span className="flex-1">
              <span className="block text-[1rem] font-semibold text-ink-900">
                {it.label}
              </span>
              {it.sublabel && (
                <span className="block text-body-sm">{it.sublabel}</span>
              )}
            </span>
            <ChevronRightIcon size={20} className="text-muted-soft" />
          </button>
        </li>
      ))}
    </ul>
  );
}

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-2 p-2">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-1 py-2">
          <ShimmerBox rounded="rounded-full" className="h-9 w-9" />
          <ShimmerBox rounded="rounded-md" className="h-4 flex-1" />
        </div>
      ))}
    </div>
  );
}
