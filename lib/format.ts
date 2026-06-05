/** tr-TR yerelleştirilmiş format yardımcıları. */

const TRY = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

export function formatTry(amount: number): string {
  return TRY.format(amount);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("tr-TR").format(value);
}

/**
 * Bir bitiş zamanına kalan süreyi "3 gün", "5 saat", "12 dk" gibi döner.
 * Geçmişse "Süre doldu" döner.
 */
export function formatRemaining(expiresAt: string | Date): string {
  const end = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
  const diffMs = end.getTime() - Date.now();
  if (Number.isNaN(diffMs) || diffMs <= 0) return "Süre doldu";

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days >= 1) return `${days} gün`;
  if (hours >= 1) return `${hours} saat`;
  return `${Math.max(minutes, 1)} dk`;
}

export function formatDate(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** Ad Soyad → "AS" gibi baş harfler (avatar fallback). */
export function initialsOf(name?: string | null): string {
  if (!name) return "EN";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "EN";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase() || "EN";
}
