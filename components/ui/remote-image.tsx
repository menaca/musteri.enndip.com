"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { shouldBypassImageOptimizer } from "@/lib/image";
import { cn } from "@/lib/utils";

type Props = Omit<ImageProps, "src" | "alt"> & {
  src?: string | null;
  alt: string;
  /** Görsel yoksa / yüklenemezse gösterilecek içerik. */
  fallback?: React.ReactNode;
  wrapperClassName?: string;
};

/**
 * next/image üzerine ince kabuk: blur-benzeri arka plan, hata fallback'i,
 * fade-in. Flutter AppNetworkImage karşılığı. Bilinmeyen host'lar için
 * `unoptimized` ile güvenli çalışır.
 */
export function RemoteImage({
  src,
  alt,
  fill = true,
  className,
  wrapperClassName,
  fallback,
  sizes = "(max-width: 768px) 100vw, 33vw",
  unoptimized,
  ...rest
}: Props) {
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const bypassOptimizer = src ? shouldBypassImageOptimizer(src) : false;

  if (!src || errored) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-sand text-muted-soft",
          wrapperClassName,
        )}
      >
        {fallback ?? <span className="text-xs">Görsel yok</span>}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden bg-sand",
        fill ? "relative size-full" : "relative",
        wrapperClassName,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        unoptimized={unoptimized ?? bypassOptimizer}
        onError={() => setErrored(true)}
        onLoad={() => setLoaded(true)}
        className={cn(
          "object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
        {...rest}
      />
    </div>
  );
}
