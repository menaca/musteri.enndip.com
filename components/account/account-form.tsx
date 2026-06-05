"use client";

import { useState } from "react";
import { AppTextField } from "@/components/ui/app-text-field";
import { AppButton } from "@/components/ui/app-button";
import { useToast } from "@/components/ui/toast";
import { updateProfileAction } from "@/lib/actions/profile";
import { validateFullName, validatePhone } from "@/lib/auth/validators";
import type { UserProfileDto } from "@/lib/api/types";

export function AccountForm({ profile }: { profile: UserProfileDto }) {
  const { show } = useToast();
  const [fullName, setFullName] = useState(profile.fullName ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [errors, setErrors] = useState<{ fullName?: string | null; phone?: string | null }>({});
  const [saving, setSaving] = useState(false);

  const dirty =
    fullName.trim() !== (profile.fullName ?? "").trim() ||
    phone.trim() !== (profile.phone ?? "").trim();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nameErr = validateFullName(fullName);
    const phoneErr = validatePhone(phone);
    setErrors({ fullName: nameErr, phone: phoneErr });
    if (nameErr || phoneErr) return;

    setSaving(true);
    const result = await updateProfileAction({ fullName, phone });
    setSaving(false);
    if (result.ok) show("Profilin güncellendi.", "success");
    else show(result.message, "error");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <AppTextField label="Ad Soyad" value={fullName} onChange={(e) => setFullName(e.target.value)} error={errors.fullName} />
      <AppTextField
        label="E-posta"
        value={profile.email ?? ""}
        readOnly
        disabled
        className="cursor-not-allowed opacity-70"
      />
      <AppTextField
        label="Telefon"
        type="tel"
        placeholder="+90 5XX XXX XX XX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        error={errors.phone}
      />
      <AppButton type="submit" isLoading={saving} disabled={!dirty} className="self-start px-8">
        Kaydet
      </AppButton>
    </form>
  );
}
