"use client";

import { useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { AppButton } from "@/components/ui/app-button";
import { useToast } from "@/components/ui/toast";
import { Routes } from "@/lib/routes";

export function SignupVerifyActions({ email }: { email: string }) {
  const { show } = useToast();
  const [loading, setLoading] = useState(false);

  async function resend() {
    if (!email) {
      show("E-posta bilgisi bulunamadı. Giriş ekranından tekrar dene.", "error");
      return;
    }
    setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}${Routes.authCallback}`,
        },
      });
      if (error) show(error.message, "error");
      else show("Doğrulama bağlantısı yeniden gönderildi.", "success");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <AppButton onClick={resend} fullWidth isLoading={loading}>
        E-postayı yeniden gönder
      </AppButton>
      <Link href={Routes.login} className="btn-ghost w-full">
        Giriş ekranına dön
      </Link>
    </div>
  );
}
