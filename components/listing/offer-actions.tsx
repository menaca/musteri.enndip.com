"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppButton } from "@/components/ui/app-button";
import { useToast } from "@/components/ui/toast";
import { CheckIcon } from "@/components/ui/icons";
import { publishListingAction } from "@/lib/actions/listings";
import { Routes } from "@/lib/routes";
import { selectionToQueryString, type VehicleSelection } from "@/lib/listing/selection";

export function OfferActions({ selection }: { selection: VehicleSelection }) {
  const router = useRouter();
  const { show } = useToast();
  const [publishing, setPublishing] = useState(false);
  const [success, setSuccess] = useState(false);

  async function onPay() {
    setPublishing(true);
    const result = await publishListingAction({
      brandId: selection.brandId,
      modelId: selection.modelId,
      engineId: selection.engineId,
      colorIds: selection.colorIds,
    });
    setPublishing(false);

    if (result.ok) {
      setSuccess(true);
      return;
    }
    if (result.needAuth) {
      show(result.message, "error");
      const back = `${Routes.listingOffer}?${selectionToQueryString(selection)}`;
      router.push(`${Routes.login}?redirectTo=${encodeURIComponent(back)}`);
      return;
    }
    show(result.message, "error");
  }

  return (
    <>
      <div className="mt-8 flex flex-col gap-3">
        <AppButton onClick={onPay} fullWidth isLoading={publishing}>
          Ödemeye Geç
        </AppButton>
        <Link
          href={Routes.findCar}
          className="text-center text-body-sm font-semibold text-ink-900 hover:underline"
        >
          Başka bir araç bul
        </Link>
      </div>

      {success && <PaymentSuccessSheet />}
    </>
  );
}

/** Ödeme/yayın başarı sheet'i — 2.2s sonra ana sayfaya yönlendirir. */
function PaymentSuccessSheet() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.push(Routes.home);
      router.refresh();
    }, 2200);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-center bg-ink-900/30">
      <div className="w-full max-w-md animate-slide-up-sheet rounded-t-3xl bg-paper p-6 pb-8 shadow-float">
        <div className="mx-auto h-1 w-10 rounded-full bg-line" />
        <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-success py-4 text-paper">
          <CheckIcon size={22} />
          <span className="text-body-lg font-bold">İlanın yayında</span>
        </div>
        <p className="mt-3 text-center text-body-md text-muted">
          7 gün boyunca teklif toplayacak. Ana sayfada aktif ilanların arasında görünür.
        </p>
        <p className="mt-1 text-center text-body-sm text-muted-soft">
          Ana sayfaya yönlendiriliyorsun…
        </p>
      </div>
    </div>
  );
}
