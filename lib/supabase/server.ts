import { cache } from "react";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { serverEnv } from "@/lib/env";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

export interface ServerAuth {
  user: Awaited<
    ReturnType<ReturnType<typeof createServerClient>["auth"]["getUser"]>
  >["data"]["user"];
  accessToken: string | null;
}

/**
 * İstek başına tek Supabase client (React.cache dedupe).
 */
/** Dış modüller (auth callback, signOut) için — istek başına tek instance. */
export const createSupabaseServerClient = cache(async () => {
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
});

/**
 * İstek başına tek auth çözümlemesi — layout + apiFetch aynı sonucu paylaşır.
 * Middleware zaten getUser ile token yenilediği için RSC'de tekrarlı
 * Supabase round-trip'leri burada birleştirilir.
 */
export const getServerAuth = cache(async (): Promise<ServerAuth> => {
  const supabase = await createSupabaseServerClient();
  const [{ data: userData }, { data: sessionData }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.auth.getSession(),
  ]);
  return {
    user: userData.user ?? null,
    accessToken: sessionData.session?.access_token ?? null,
  };
});

/** Geçerli kullanıcı (yoksa null). getUser() token'ı sunucuda doğrular. */
export async function getCurrentUser() {
  const { user } = await getServerAuth();
  return user;
}

/** Geçerli access token (BFF Bearer için). Yoksa null. */
export async function getAccessToken(): Promise<string | null> {
  const { accessToken } = await getServerAuth();
  return accessToken;
}
