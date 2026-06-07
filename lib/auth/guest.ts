import { cache } from "react";
import { cookies } from "next/headers";

/**
 * Guest (misafir) modu. Mobil "Giriş yapmadan devam et" karşılığı.
 * Ephemeral cookie ile işaretlenir; oturum açılınca temizlenir.
 */
export const GUEST_COOKIE = "enndip_guest";

export const isGuest = cache(async (): Promise<boolean> => {
  const store = await cookies();
  return store.get(GUEST_COOKIE)?.value === "1";
});
