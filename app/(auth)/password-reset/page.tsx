import Link from "next/link";
import type { Metadata } from "next";
import { PasswordResetForm } from "@/components/auth/password-reset-form";
import { Routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Şifremi Unuttum" };

export default function PasswordResetPage() {
  return (
    <>
      <Link
        href={Routes.login}
        className="text-body-sm font-semibold text-muted hover:text-ink-900 hover:underline"
      >
        ← Girişe dön
      </Link>
      <div className="mt-6">
        <h1 className="text-display-md">Şifreni mi unuttun?</h1>
        <p className="mt-2 text-body-md text-muted">
          E-posta adresini gir, sana sıfırlama bağlantısı gönderelim.
        </p>
      </div>
      <div className="mt-8">
        <PasswordResetForm />
      </div>
    </>
  );
}
