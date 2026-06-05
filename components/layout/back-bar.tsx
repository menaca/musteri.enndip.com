"use client";

import { useRouter } from "next/navigation";
import { ArrowBackIcon } from "@/components/ui/icons";

/** Geri butonu (Flutter ListingGeriBar / AppPageScaffold back). */
export function BackBar({
  label = "Geri",
  fallbackHref = "/",
}: {
  label?: string;
  fallbackHref?: string;
}) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) router.back();
        else router.push(fallbackHref);
      }}
      className="inline-flex items-center gap-2 text-[0.95rem] font-semibold text-ink-900 hover:opacity-70"
    >
      <ArrowBackIcon size={20} />
      {label}
    </button>
  );
}
