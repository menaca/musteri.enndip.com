/** Auth form doğrulayıcıları — Flutter login/register ile aynı kurallar. */

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function validateEmail(v: string): string | null {
  const t = v.trim();
  if (!t) return "E-posta gerekli.";
  if (!EMAIL_RE.test(t)) return "Geçerli bir e-posta gir.";
  return null;
}

export function validatePassword(v: string): string | null {
  if (!v) return "Şifre gerekli.";
  if (v.length < 6) return "Şifre en az 6 karakter olmalı.";
  return null;
}

export function validateFullName(v: string): string | null {
  const t = v.trim();
  if (!t) return "Ad Soyad gerekli.";
  if (t.length < 2) return "Ad Soyad en az 2 karakter olmalı.";
  return null;
}

export function validatePhone(v: string): string | null {
  const t = v.trim();
  if (!t) return null; // opsiyonel
  if (!/^\+?[0-9]{7,15}$/.test(t.replace(/\s/g, ""))) {
    return "Geçerli bir telefon numarası gir.";
  }
  return null;
}

export function isEmailNotConfirmed(message?: string | null): boolean {
  if (!message) return false;
  const t = message.toLowerCase();
  return t.includes("doğrulan") || t.includes("email not confirmed") || t.includes("not confirmed");
}
