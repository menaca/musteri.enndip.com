"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { AppTextField } from "@/components/ui/app-text-field";
import { AppButton } from "@/components/ui/app-button";
import { useToast } from "@/components/ui/toast";
import { KvkkConsent } from "./kvkk-consent";
import { Routes } from "@/lib/routes";
import {
  validateEmail,
  validatePassword,
  validateFullName,
  validatePhone,
} from "@/lib/auth/validators";

export function RegisterForm() {
  const router = useRouter();
  const { show } = useToast();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: Record<string, string | null> = {
      fullName: validateFullName(fullName),
      email: validateEmail(email),
      phone: validatePhone(phone),
      password: validatePassword(password),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;
    if (!consent) {
      show("Devam etmek için KVKK metnini onayla.", "error");
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}${Routes.authCallback}`,
          data: {
            full_name: fullName.trim(),
            phone: phone.trim() || undefined,
            registration_app: "enndip",
          },
        },
      });
      if (error) {
        show(error.message, "error");
        return;
      }
      // Supabase: zaten kayıtlı e-posta için identities boş döner.
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        show("Bu e-posta ile zaten bir hesap var. Giriş yap.", "error");
        return;
      }
      router.replace(`${Routes.signupVerify}?email=${encodeURIComponent(email.trim())}`);
    } catch {
      show("Kayıt oluşturulamadı. Tekrar dene.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <AppTextField
        label="Ad Soyad"
        autoComplete="name"
        placeholder="Adın Soyadın"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        error={errors.fullName}
      />
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
        label="Telefon (opsiyonel)"
        type="tel"
        autoComplete="tel"
        placeholder="+90 5XX XXX XX XX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        error={errors.phone}
      />
      <AppTextField
        label="Şifre"
        password
        autoComplete="new-password"
        placeholder="En az 6 karakter"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />

      <KvkkConsent checked={consent} onChange={setConsent} />

      <AppButton type="submit" fullWidth isLoading={loading}>
        Kayıt Ol
      </AppButton>
    </form>
  );
}
