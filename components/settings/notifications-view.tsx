"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { BellIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type NotifType = "bid" | "listing" | "promo";

interface Notif {
  id: string;
  title: string;
  body: string;
  type: NotifType;
  hoursAgo: number;
  read: boolean;
}

// Backend push/inbox entegrasyonu gelene kadar örnek bildirimler (mobille aynı).
const SEED: Notif[] = [
  {
    id: "1",
    title: "Yeni teklif geldi",
    body: "Volkswagen Bayi İstanbul, Passat ilanın için 1.245.000 ₺ teklif verdi.",
    type: "bid",
    hoursAgo: 2,
    read: false,
  },
  {
    id: "2",
    title: "İlan süren dolmak üzere",
    body: "Civic ilanının teklif toplama süresi 24 saat içinde sona erecek.",
    type: "listing",
    hoursAgo: 24,
    read: false,
  },
  {
    id: "3",
    title: "Yeni SUV kampanyası",
    body: "Bu aya özel SUV segmentinde ek bayi teklifleri başladı.",
    type: "promo",
    hoursAgo: 72,
    read: true,
  },
];

function timeLabel(hoursAgo: number): string {
  if (hoursAgo < 24) return `${hoursAgo} saat önce`;
  const days = Math.floor(hoursAgo / 24);
  return `${days} gün önce`;
}

export function NotificationsView() {
  const [items, setItems] = useState<Notif[]>(SEED);
  const unread = useMemo(() => items.filter((i) => !i.read).length, [items]);

  function markRead(id: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, read: true } : i)));
  }
  function markAll() {
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<BellIcon size={40} />}
        title="Bildirim yok"
        description="Yeni teklif ve ilan güncellemeleri burada görünecek."
      />
    );
  }

  return (
    <>
      {unread > 0 && (
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={markAll}
            className="text-body-sm font-semibold text-ink-900 hover:underline"
          >
            Tümünü oku
          </button>
        </div>
      )}
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => markRead(item.id)}
              className={cn(
                "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
                item.read ? "border-transparent bg-cream" : "border-line bg-paper hover:bg-cream",
              )}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sand">
                <NotifIcon type={item.type} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={cn("text-body-lg", item.read ? "font-semibold" : "font-bold")}>
                    {item.title}
                  </span>
                  {!item.read && <span className="h-2 w-2 shrink-0 rounded-full bg-ink-900" />}
                </div>
                <p className="mt-1 text-body-md text-muted">{item.body}</p>
                <p className="mt-1.5 text-body-sm font-semibold text-muted-soft">
                  {timeLabel(item.hoursAgo)}
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

function NotifIcon({ type }: { type: NotifType }) {
  const color =
    type === "bid" ? "text-ink-900" : type === "promo" ? "text-accent" : "text-muted";
  return <BellIcon size={20} className={color} />;
}
