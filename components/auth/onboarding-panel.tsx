import Image from "next/image";
import { Logo } from "@/components/ui/logo";
import { GuestContinue } from "@/components/auth/guest-continue";
import { getOnboardingSlide } from "@/lib/api/queries";
import type { OnboardingSlideDto } from "@/lib/api/types";

const FALLBACK: OnboardingSlideDto = {
  id: "fallback",
  imageUrl: "",
  title: "Sıfır araçta en uygun fiyatlar enndip.com'da",
  description: "Dakikalar içinde ilan oluştur, senin için enndip fiyatı bulalım!",
  ctaPrimaryLabel: "Giriş Yap",
  ctaSecondaryLabel: "Giriş yapmadan devam et.",
  locale: "tr",
};

/** Auth split layout — sol panel: DB-driven onboarding hero (sabit). */
export async function OnboardingPanel() {
  let slide = FALLBACK;
  try {
    slide = await getOnboardingSlide("tr");
  } catch {
    slide = FALLBACK;
  }

  return (
    <aside className="relative hidden min-h-dvh flex-col overflow-hidden bg-ink-900 lg:sticky lg:top-0 lg:flex lg:h-dvh">
      {slide.imageUrl ? (
        <Image
          src={slide.imageUrl}
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover opacity-45"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/75 to-ink-900/40" />

      <div className="relative flex min-h-dvh flex-col px-10 py-10 xl:px-14 xl:py-12">
        <Logo light className="text-xl" />

        <div className="mt-auto max-w-lg">
          <h2 className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-paper xl:text-4xl">
            {slide.title}
          </h2>
          {slide.description && (
            <p className="mt-4 text-balance text-base leading-relaxed text-paper/75 xl:text-lg">
              {slide.description}
            </p>
          )}
          <div className="mt-8">
            <GuestContinue
              label={slide.ctaSecondaryLabel || "Giriş yapmadan devam et."}
              className="text-paper/85 hover:text-paper"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
