"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { AppTextField } from "@/components/ui/app-text-field";
import { AppButton } from "@/components/ui/app-button";
import { useToast } from "@/components/ui/toast";
import { Routes } from "@/lib/routes";
import { authCallbackUrl } from "@/lib/site-url";
import { validateEmail } from "@/lib/auth/validators";

export function PasswordResetForm() {
  const router = useRouter();
  const { show } = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validateEmail(email);
    setError(err);
    if (err) return;

    setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo: authCallbackUrl(Routes.account) },
      );
      if (resetError) {
        show(resetError.message, "error");
        return;
      }
      setSent(true);
      show("Şifre sıfırlama bağlantısı e-postana gönderildi.", "success");
      setTimeout(() => router.replace(Routes.login), 1200);
    } catch {
      show("Bağlantı gönderilemedi. Tekrar dene.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <AppTextField
        label="E-posta"
        type="email"
        autoComplete="email"
        placeholder="ornek@enndip.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
        disabled={sent}
      />
      <AppButton type="submit" fullWidth isLoading={loading} disabled={sent}>
        {sent ? "Gönderildi" : "Bağlantı Gönder"}
      </AppButton>
    </form>
  );
}
