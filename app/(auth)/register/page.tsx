import Link from "next/link";
import type { Metadata } from "next";
import { SocialSignIn } from "@/components/auth/social-sign-in";
import { RegisterForm } from "@/components/auth/register-form";
import { Routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Kayıt Ol" };

export default function RegisterPage() {
  return (
    <>
      <div>
        <h1 className="text-display-md">Hesap oluştur</h1>
        <p className="mt-2 text-body-md text-muted">
          enndip&apos;e katıl, sıfır araç için en uygun teklifleri al.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-6">
        <SocialSignIn nextPath={Routes.home} />
        <RegisterForm />
      </div>

      <p className="mt-6 text-center text-body-md text-muted lg:text-left">
        Zaten hesabın var mı?{" "}
        <Link href={Routes.login} className="font-bold text-ink-900 hover:underline">
          Giriş Yap
        </Link>
      </p>
    </>
  );
}
