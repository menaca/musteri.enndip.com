import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { LoginInteractive } from "@/components/auth/login-interactive";
import { GuestContinue } from "@/components/auth/guest-continue";
import { Routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Giriş Yap" };

export default function LoginPage() {
  return (
    <>
      <div>
        <h1 className="text-display-md">Tekrar hoş geldin</h1>
        <p className="mt-2 text-body-md text-muted">
          E-posta ve şifrenle veya hızlı giriş ile hesabına bağlan.
        </p>
      </div>

      <div className="mt-8">
        <Suspense fallback={<div className="h-72" />}>
          <LoginInteractive />
        </Suspense>
      </div>

      <div className="mt-6 flex flex-col items-center gap-5 lg:items-stretch">
        <p className="text-center text-body-md text-muted lg:text-left">
          Hesabın yok mu?{" "}
          <Link href={Routes.register} className="font-bold text-ink-900 hover:underline">
            Kayıt Ol
          </Link>
        </p>
        <div className="lg:hidden">
          <GuestContinue />
        </div>
      </div>
    </>
  );
}
