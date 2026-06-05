"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CloseIcon, RotateIcon } from "@/components/ui/icons";
import { Spinner } from "@/components/ui/spinner";
import type { ImagerySlide } from "@/lib/api/types";

const PIXELS_PER_FRAME = 8;

/** 360° spin görüntüleyici — sürükleyerek döndür (Flutter spin sheet). */
export function SpinViewer({
  open,
  onClose,
  modelId,
  paintId,
  paintDescription,
}: {
  open: boolean;
  onClose: () => void;
  modelId: string;
  paintId?: string | null;
  paintDescription?: string | null;
}) {
  const [frames, setFrames] = useState<ImagerySlide[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragAccum = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    let active = true;
    setLoading(true);
    const params = new URLSearchParams({ modelId });
    if (paintId) params.set("paintId", paintId);
    if (paintDescription) params.set("paintDescription", paintDescription);
    fetch(`/api/imagery/spin?${params.toString()}`)
      .then((r) => r.json())
      .then((data: { frames?: ImagerySlide[] }) => {
        if (!active) return;
        setFrames(data.frames ?? []);
        setIndex(0);
        dragAccum.current = 0;
      })
      .catch(() => active && setFrames([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [open, modelId, paintId, paintDescription]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function applyFrameDelta(delta: number) {
    if (frames.length < 2) return;
    setIndex((i) => (i + delta + frames.length) % frames.length);
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (loading || frames.length < 2) return;
    e.preventDefault();
    stageRef.current?.setPointerCapture(e.pointerId);
    dragAccum.current = 0;
    setDragging(true);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging || loading || frames.length < 2) return;
    e.preventDefault();
    dragAccum.current += e.movementX;
    while (dragAccum.current >= PIXELS_PER_FRAME) {
      dragAccum.current -= PIXELS_PER_FRAME;
      applyFrameDelta(1);
    }
    while (dragAccum.current <= -PIXELS_PER_FRAME) {
      dragAccum.current += PIXELS_PER_FRAME;
      applyFrameDelta(-1);
    }
  }

  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    if (stageRef.current?.hasPointerCapture(e.pointerId)) {
      stageRef.current.releasePointerCapture(e.pointerId);
    }
    dragAccum.current = 0;
    setDragging(false);
  }

  const current = frames[index];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink-900/80 p-4 animate-fade-in">
      <button
        type="button"
        onClick={onClose}
        aria-label="Kapat"
        className="absolute right-4 top-4 rounded-full bg-paper/15 p-2 text-paper hover:bg-paper/25"
      >
        <CloseIcon size={24} />
      </button>

      <div className="w-full max-w-2xl">
        <div
          ref={stageRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="relative aspect-[16/10] w-full cursor-grab touch-none select-none rounded-3xl bg-paper active:cursor-grabbing"
        >
          {loading ? (
            <div className="flex h-full items-center justify-center text-ink-900">
              <Spinner size={28} />
            </div>
          ) : current ? (
            <Image
              src={current.url}
              alt="360 görünüm"
              fill
              unoptimized
              draggable={false}
              sizes="(max-width: 768px) 100vw, 640px"
              className="pointer-events-none object-contain"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted">
              360° görünüm bulunamadı
            </div>
          )}
        </div>
        {!loading && frames.length > 1 && (
          <p className="mt-4 flex items-center justify-center gap-2 text-body-sm text-paper/80">
            <RotateIcon size={18} /> Döndürmek için sürükle
          </p>
        )}
        {!loading && frames.length === 1 && (
          <p className="mt-4 text-center text-body-sm text-paper/80">
            Bu araç için tek açı mevcut
          </p>
        )}
      </div>
    </div>
  );
}
