import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { serverEnv } from "@/lib/env";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

/**
 * Sunucu Supabase client'ı (RSC / server action).
 * Oturum cookie'den okunur. RSC içinde cookie yazma denemeleri sessizce
 * yutulur (middleware token'ı zaten tazeliyor).
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(serverEnv.supabaseUrl, serverEnv.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // RSC'den çağrıldı — middleware oturum yenilemesi varsa yok sayılabilir.
        }
      },
    },
  });
}

/** Geçerli kullanıcı (yoksa null). getUser() token'ı sunucuda doğrular. */
export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
}

/** Geçerli access token (BFF Bearer için). Yoksa null. */
export async function getAccessToken(): Promise<string | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}
