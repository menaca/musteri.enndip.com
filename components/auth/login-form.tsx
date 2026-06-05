"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { AppTextField } from "@/components/ui/app-text-field";
import { AppButton } from "@/components/ui/app-button";
import { useToast } from "@/components/ui/toast";
import { AlertIcon } from "@/components/ui/icons";
import { Routes } from "@/lib/routes";
import { validateEmail, validatePassword, isEmailNotConfirmed } from "@/lib/auth/validators";
import { authCallbackUrl } from "@/lib/site-url";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { show } = useToast();
  const nextPath = params.get("redirectTo") || Routes.home;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string | null; password?: string | null }>({});
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [unconfirmed, setUnconfirmed] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    setErrors({ email: emailErr, password: passErr });
    if (emailErr || passErr) return;

    setLoading(true);
    setUnconfirmed(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        if (isEmailNotConfirmed(error.message)) {
          setUnconfirmed(
            "E-posta adresin henüz doğrulanmamış. Gelen kutunu kontrol et.",
          );
        } else {
          show(translateAuthError(error.message), "error");
        }
        return;
      }
      router.replace(nextPath);
      router.refresh();
    } catch {
      show("Giriş yapılamadı. Tekrar dene.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function resendVerification() {
    if (!email.trim()) {
      show("Önce e-posta adresini gir.", "error");
      return;
    }
    setResending(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
        options: {
          emailRedirectTo: authCallbackUrl(),
        },
      });
      if (error) show(error.message, "error");
      else show("Doğrulama bağlantısı e-postana yeniden gönderildi.", "success");
    } finally {
      setResending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      {unconfirmed && (
        <div className="flex items-start gap-2.5 rounded-xl border border-danger/45 bg-danger/10 p-3.5">
          <AlertIcon size={18} className="mt-0.5 shrink-0 text-danger" />
          <p className="text-body-sm text-danger">
            {unconfirmed}{" "}
            <button
              type="button"
              onClick={resendVerification}
              disabled={resending}
              className="font-semibold text-link underline disabled:opacity-60"
            >
              {resending ? "Gönderiliyor…" : "Tekrar gönder"}
            </button>
          </p>
        </div>
      )}

      <AppTextField
        label="E-posta"
        type="email"
        autoComplete="email"
        placeholder="ornek@enndip.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <AppTextField
        label="Şifre"
        password
        autoComplete="current-password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />

      <div className="-mt-1 text-right">
        <Link
          href={Routes.passwordReset}
          className="text-body-sm font-semibold text-ink-900 hover:underline"
        >
          Şifremi Unuttum
        </Link>
      </div>

      <AppButton type="submit" fullWidth isLoading={loading}>
        Giriş Yap
      </AppButton>
    </form>
  );
}

function translateAuthError(message: string): string {
  const t = message.toLowerCase();
  if (t.includes("invalid login credentials")) {
    return "E-posta veya şifre hatalı.";
  }
  if (t.includes("rate limit")) {
    return "Çok fazla deneme. Lütfen biraz sonra tekrar dene.";
  }
  return message;
}
