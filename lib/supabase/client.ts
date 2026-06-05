"use client";

import { createBrowserClient } from "@supabase/ssr";
import { publicEnv } from "@/lib/env";

/**
 * Tarayıcı Supabase client'ı (anon key, PKCE).
 * Yalnızca: login/signup/OAuth başlatma, şifre sıfırlama, onAuthStateChange.
 * Korumalı veri çağrıları NEVER buradan — onlar BFF (server) üzerinden gider.
 * Oturum çerezleri @supabase/ssr tarafından httpOnly yönetilir.
 */
let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient;
  browserClient = createBrowserClient(
    publicEnv.supabaseUrl,
    publicEnv.supabaseAnonKey,
  );
  return browserClient;
}
