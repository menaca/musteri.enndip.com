import { redirect } from "next/navigation";
import { Routes } from "@/lib/routes";

/** Onboarding artık auth split layout sol panelinde; bu rota login'e yönlendirir. */
export default function OnboardingPage() {
  redirect(Routes.login);
}
