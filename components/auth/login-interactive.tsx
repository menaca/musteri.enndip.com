"use client";

import { useSearchParams } from "next/navigation";
import { SocialSignIn } from "./social-sign-in";
import { LoginForm } from "./login-form";
import { Routes } from "@/lib/routes";

/** Social + email login bir arada; redirectTo'yu tek yerden okur. */
export function LoginInteractive() {
  const params = useSearchParams();
  const nextPath = params.get("redirectTo") || Routes.home;
  return (
    <div className="flex flex-col gap-6">
      <SocialSignIn nextPath={nextPath} />
      <LoginForm />
    </div>
  );
}
