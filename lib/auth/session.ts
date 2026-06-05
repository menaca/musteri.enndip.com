import { getCurrentUser } from "@/lib/supabase/server";
import { isGuest } from "@/lib/auth/guest";

export interface SessionIdentity {
  isAuthed: boolean;
  isGuest: boolean;
  displayName: string;
  email: string | null;
  avatarUrl: string | null;
}

/**
 * Drawer/sidebar başlığı için kimlik özeti.
 * Mobil davranışı: ad varsa ad, yoksa "enndip kullanıcısı", guest ise
 * "Misafir Kullanıcı".
 */
export async function getSessionIdentity(): Promise<SessionIdentity> {
  const user = await getCurrentUser();
  const guest = await isGuest();

  if (user) {
    const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
    const name =
      (typeof meta.full_name === "string" && meta.full_name.trim()) ||
      (typeof meta.name === "string" && meta.name.trim()) ||
      "";
    const avatar =
      (typeof meta.avatar_url === "string" && meta.avatar_url) ||
      (typeof meta.picture === "string" && meta.picture) ||
      null;
    return {
      isAuthed: true,
      isGuest: false,
      displayName: name || "enndip kullanıcısı",
      email: user.email ?? null,
      avatarUrl: avatar,
    };
  }

  return {
    isAuthed: false,
    isGuest: guest,
    displayName: guest ? "Misafir Kullanıcı" : "Hoş geldin",
    email: null,
    avatarUrl: null,
  };
}
