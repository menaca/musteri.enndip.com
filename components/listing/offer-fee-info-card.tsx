import { TagIcon } from "@/components/ui/icons";
import { formatTry } from "@/lib/format";

/** Teklif bedeli bilgi kartı (yeşil vurgu) — Flutter OfferFeeInfoCard. */
export function OfferFeeInfoCard({ amountTry }: { amountTry: number }) {
  return (
    <div className="rounded-3xl border border-accent/30 bg-accent/8 p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
          <TagIcon size={22} />
        </span>
        <div className="flex-1">
          <p className="text-heading-sm">Teklif bedeli</p>
          <p className="mt-1 text-body-sm text-muted">
            İlanını yayınlamak ve yetkili bayilerden teklif toplamak için tek seferlik
            bedel. İlan 7 gün boyunca aktif kalır.
          </p>
        </div>
        <span className="text-heading-md text-accent">{formatTry(amountTry)}</span>
      </div>
    </div>
  );
}
