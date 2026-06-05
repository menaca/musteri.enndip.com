import type { ListingDto } from "@/lib/api/types";

/** İlan durum mantığı — Flutter UserListing ile birebir. */
export function isLive(listing: ListingDto): boolean {
  return (
    listing.status === "collecting_bids" &&
    new Date(listing.expiresAt).getTime() > Date.now()
  );
}

export function effectiveStatus(listing: ListingDto): string {
  if (isLive(listing)) return "collecting_bids";
  if (listing.status === "collecting_bids") return "expired";
  return listing.status;
}

export function statusLabel(listing: ListingDto): string {
  switch (effectiveStatus(listing)) {
    case "collecting_bids":
      return "Teklifler Toplanıyor";
    case "awarded":
      return "Satış Tamamlandı";
    case "expired":
      return "Süresi Doldu";
    case "cancelled":
      return "İptal Edildi";
    default:
      return effectiveStatus(listing);
  }
}

export function canCancel(listing: ListingDto): boolean {
  return isLive(listing);
}

export type ListingFilter = "all" | "active" | "past";

export function matchesFilter(listing: ListingDto, filter: ListingFilter): boolean {
  if (filter === "all") return true;
  if (filter === "active") return isLive(listing);
  return !isLive(listing);
}
