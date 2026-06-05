"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { ReceiptIcon, PlusIcon } from "@/components/ui/icons";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { cancelListingAction } from "@/lib/actions/listings";
import {
  matchesFilter,
  statusLabel,
  canCancel,
  isLive,
  type ListingFilter,
} from "@/lib/listing/status";
import { formatRemaining, formatNumber } from "@/lib/format";
import { Routes } from "@/lib/routes";
import type { ListingDto } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const FILTERS: { id: ListingFilter; label: string }[] = [
  { id: "all", label: "Tümü" },
  { id: "active", label: "Aktif" },
  { id: "past", label: "Geçmiş" },
];

export function MyListingsView({ listings }: { listings: ListingDto[] }) {
  const router = useRouter();
  const { show } = useToast();
  const [filter, setFilter] = useState<ListingFilter>("all");
  const [pending, startTransition] = useTransition();
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const visible = listings.filter((l) => matchesFilter(l, filter));

  function onCancel(listing: ListingDto) {
    if (!confirm(`"${listing.brandName} ${listing.modelName}" ilanını iptal etmek istediğine emin misin?`)) {
      return;
    }
    setCancelingId(listing.id);
    startTransition(async () => {
      const result = await cancelListingAction(listing.id);
      setCancelingId(null);
      if (result.ok) {
        show("İlan iptal edildi.", "success");
        router.refresh();
      } else {
        show(result.message, "error");
      }
    });
  }

  return (
    <>
      <div className="mb-6 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-pill border px-5 py-2 text-sm font-semibold transition-colors",
              filter === f.id
                ? "border-ink-900 bg-ink-900 text-paper"
                : "border-line bg-paper text-muted hover:border-ink-900",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={<ReceiptIcon size={40} />}
          title={filter === "all" ? "Henüz ilanın yok" : "Bu filtrede ilan yok"}
          description="Sıfır araç için ilan oluştur, yetkili bayiler en uygun teklifi sunsun."
          action={
            <Link href={Routes.findCar} className="btn-primary">
              <PlusIcon size={18} className="text-paper" /> Yeni İlan Oluştur
            </Link>
          }
        />
      ) : (
        <ul className="flex flex-col gap-4">
          {visible.map((listing) => {
            const live = isLive(listing);
            return (
              <li
                key={listing.id}
                className="flex flex-col gap-4 rounded-3xl border border-line bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-heading-sm">
                      {listing.brandName} {listing.modelName}
                    </span>
                    <span
                      className={cn(
                        "rounded-pill px-2.5 py-1 text-xs font-semibold",
                        live ? "bg-accent/12 text-accent" : "bg-sand text-muted",
                      )}
                    >
                      {statusLabel(listing)}
                    </span>
                  </div>
                  <p className="mt-1 text-body-sm">{listing.engineName}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-body-sm">
                    <span>{formatNumber(listing.bidCount)} teklif</span>
                    {live && <span>{formatRemaining(listing.expiresAt)} kaldı</span>}
                  </div>
                </div>

                {canCancel(listing) && (
                  <button
                    type="button"
                    onClick={() => onCancel(listing)}
                    disabled={pending && cancelingId === listing.id}
                    className="inline-flex items-center justify-center gap-2 rounded-pill border border-danger/40 px-5 py-2.5 text-sm font-semibold text-danger transition-colors hover:bg-danger/8 disabled:opacity-50"
                  >
                    {pending && cancelingId === listing.id && <Spinner size={16} className="text-danger" />}
                    İlanı İptal Et
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
