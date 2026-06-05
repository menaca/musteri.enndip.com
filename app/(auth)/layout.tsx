import type { ReactNode } from "react";
import { OnboardingPanel } from "@/components/auth/onboarding-panel";
import { Logo } from "@/components/ui/logo";

/**
 * Auth split layout — web: sol onboarding (sabit), sağ login/register/form.
 * Mobil: yalnızca sağ panel (dar, ortalanmış).
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-paper lg:grid lg:grid-cols-2">
      <OnboardingPanel />

      <div className="flex min-h-dvh flex-col">
        <div className="px-6 pt-8 lg:hidden">
          <Logo className="text-xl" />
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-8 sm:py-10 lg:max-w-lg lg:px-10 lg:py-12">
          {children}
        </div>
      </div>
    </div>
  );
}
