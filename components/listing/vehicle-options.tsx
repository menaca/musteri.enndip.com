"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BackBar } from "@/components/layout/back-bar";
import { AppButton } from "@/components/ui/app-button";
import { RotateIcon, GlobeIcon, ChevronRightIcon, CheckIcon } from "@/components/ui/icons";
import { Spinner } from "@/components/ui/spinner";
import { SpinViewer } from "./spin-viewer";
import { PanelSpec } from "./panel-spec";
import { Routes } from "@/lib/routes";
import { selectionToQueryString, type VehicleSelection } from "@/lib/listing/selection";
import type { CarModelColorDto, CarModelPanelSpecDto } from "@/lib/api/types";
import { toDisplayHex } from "@/lib/color";
import { cn } from "@/lib/utils";

export function VehicleOptions({
  selection,
  modelName,
  modelWebsiteUrl,
  colors,
  panelSpec,
  initialImages,
}: {
  selection: VehicleSelection;
  modelName: string;
  modelWebsiteUrl: string | null;
  colors: CarModelColorDto[];
  panelSpec: CarModelPanelSpecDto | null;
  initialImages: string[];
}) {
  const router = useRouter();
  const firstColor = colors[0];

  const [images, setImages] = useState<string[]>(initialImages);
  const [imgIndex, setImgIndex] = useState(0);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [previewColorId, setPreviewColorId] = useState<string | undefined>(firstColor?.id);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(colors.length === 1 && firstColor ? [firstColor.id] : []),
  );
  const [spinOpen, setSpinOpen] = useState(false);

  const previewColor = useMemo(
    () => colors.find((c) => c.id === previewColorId),
    [colors, previewColorId],
  );

  async function loadGallery(color: CarModelColorDto) {
    setImagesLoading(true);
    setPreviewColorId(color.id);
    try {
      const params = new URLSearchParams({ modelId: selection.modelId });
      if (color.imaginPaintId) params.set("paintId", color.imaginPaintId);
      if (color.imaginPaintDescription)
        params.set("paintDescription", color.imaginPaintDescription);
      const res = await fetch(`/api/imagery/gallery?${params.toString()}`);
      const data = (await res.json()) as { slides?: { url: string }[] };
      const urls = (data.slides ?? []).map((s) => s.url);
      if (urls.length) {
        setImages(urls);
        setImgIndex(0);
      }
    } catch {
      // mevcut görseller korunur
    } finally {
      setImagesLoading(false);
    }
  }

  function onColorTap(color: CarModelColorDto) {
    void loadGallery(color);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(color.id)) next.delete(color.id);
      else next.add(color.id);
      return next;
    });
  }

  const canContinue = colors.length === 0 || selectedIds.size > 0;

  function onContinue() {
    const next: VehicleSelection = {
      ...selection,
      colorIds: Array.from(selectedIds),
    };
    router.push(`${Routes.listingSummary}?${selectionToQueryString(next)}`);
  }

  const current = images[imgIndex];

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-4">
        <BackBar fallbackHref={Routes.findCar} />
      </div>

      {/* Başlık */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-display-md leading-tight">
            {selection.brandName} {modelName}
          </h1>
          <p className="mt-1 text-body-md text-muted">
            {selection.trimName ? `${selection.trimName} · ` : ""}
            {selection.engineName}
          </p>
        </div>
        {modelWebsiteUrl && (
          <a
            href={modelWebsiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex shrink-0 items-center gap-1.5 text-body-sm font-semibold text-link hover:underline"
          >
            <GlobeIcon size={16} /> İncele
          </a>
        )}
      </div>

      {/* Görsel + 360 */}
      <div className="relative mt-5 aspect-[16/10] w-full overflow-hidden rounded-3xl bg-card">
        {current ? (
          <Image
            key={current}
            src={current}
            alt={`${selection.brandName} ${modelName}`}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 700px"
            className={cn("object-contain transition-opacity", imagesLoading && "opacity-50")}
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">
            Görsel bulunamadı
          </div>
        )}

        {imagesLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner size={28} className="text-ink-900" />
          </div>
        )}

        <button
          type="button"
          onClick={() => setSpinOpen(true)}
          className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-pill bg-ink-900/90 px-4 py-2 text-sm font-semibold text-paper backdrop-blur hover:bg-ink-900"
        >
          <RotateIcon size={18} /> 360°
        </button>
      </div>

      {/* Görsel küçük resimler */}
      {images.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setImgIndex(i)}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border bg-card",
                i === imgIndex ? "border-ink-900" : "border-line",
              )}
            >
              <Image src={url} alt="" fill unoptimized sizes="96px" className="object-contain" />
            </button>
          ))}
        </div>
      )}

      {/* Renk seçimi */}
      {colors.length > 0 && (
        <section className="mt-8">
          <h2 className="text-heading-md">Renk tercihin</h2>
          <p className="mt-1 text-body-sm">
            Bir veya daha fazla renk seç. Görseli güncellemek için renge dokun.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {colors.map((color) => {
              const selected = selectedIds.has(color.id);
              const isPreview = previewColorId === color.id;
              const hex = toDisplayHex(color.hexCode);
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => onColorTap(color)}
                  className={cn(
                    "flex items-center gap-2 rounded-pill border px-3 py-2 text-sm font-medium transition-colors",
                    selected ? "border-ink-900 bg-ink-900 text-paper" : "border-line bg-paper text-ink-900",
                    !selected && isPreview && "border-ink-900",
                  )}
                  title={color.name}
                >
                  <span
                    className="h-5 w-5 rounded-full border border-line"
                    style={{ backgroundColor: hex }}
                  />
                  {color.name}
                  {selected && <CheckIcon size={16} />}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Teknik özellikler */}
      <div className="mt-8">
        <PanelSpec spec={panelSpec} />
      </div>

      {/* Devam */}
      <div className="mt-10 flex flex-col gap-3">
        <AppButton onClick={onContinue} fullWidth disabled={!canContinue}>
          Bu Araç İçin İlan Oluştur
          <ChevronRightIcon size={18} className="text-paper" />
        </AppButton>
        <Link
          href={Routes.findCar}
          className="text-center text-body-sm font-semibold text-ink-900 hover:underline"
        >
          Başka bir araç bul
        </Link>
      </div>

      <SpinViewer
        open={spinOpen}
        onClose={() => setSpinOpen(false)}
        modelId={selection.modelId}
        paintId={previewColor?.imaginPaintId}
        paintDescription={previewColor?.imaginPaintDescription}
      />
    </div>
  );
}
