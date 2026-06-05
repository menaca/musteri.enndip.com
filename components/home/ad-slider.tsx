"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { HomeAdDto } from "@/lib/api/types";
import { cn } from "@/lib/utils";

/** Promosyon reklam slider'ı (Jaecoo vb.) — otomatik ilerler, RepaintBoundary benzeri. */
export function AdSlider({ ads }: { ads: HomeAdDto[] }) {
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (ads.length <= 1) return;
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % ads.length);
    }, 4500);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [ads.length]);

  if (!ads.length) return null;
  const current = ads[index]!;

  const card = (
    <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl bg-sand">
      <Image
        key={current.id}
        src={current.imageUrl}
        alt={current.title}
        fill
        sizes="(max-width: 1024px) 100vw, 900px"
        className="animate-fade-in object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-ink-900/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-paper sm:p-7">
        {current.brand && (
          <p className="text-xs font-semibold uppercase tracking-widest opacity-80">
            {current.brand}
          </p>
        )}
        <p className="mt-1 text-heading-md text-paper">{current.title}</p>
        {current.subtitle && (
          <p className="mt-1 text-body-md text-paper/85">{current.subtitle}</p>
        )}
      </div>
      {ads.length > 1 && (
        <div className="absolute right-4 top-4 flex gap-1.5">
          {ads.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full bg-paper transition-all",
                i === index ? "w-5 opacity-100" : "w-1.5 opacity-50",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );

  return current.linkUrl ? (
    <a href={current.linkUrl} target="_blank" rel="noopener noreferrer" className="block">
      {card}
    </a>
  ) : (
    card
  );
}
