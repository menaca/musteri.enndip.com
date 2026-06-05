import "server-only";

import { serverEnv } from "@/lib/env";
import { getAccessToken } from "@/lib/supabase/server";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type AuthMode = "required" | "optional" | "none";

interface ApiFetchOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  /** required: token yoksa 401 fırlat. optional: varsa ekle. none: hiç ekleme. */
  auth?: AuthMode;
  /** RSC cache. saniye cinsinden revalidate veya no-store. */
  revalidate?: number | false;
  cache?: RequestCache;
  signal?: AbortSignal;
}

/**
 * BFF çekirdeği. Yalnızca sunucuda çalışır. Supabase access token cookie'den
 * okunur, NestJS'e Bearer olarak eklenir. Token tarayıcıya HİÇ inmez.
 */
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { method = "GET", body, auth = "optional", revalidate, cache, signal } =
    options;

  const headers: Record<string, string> = {
    Accept: "application/json",
    "X-App-Source": "musteri_portal",
  };

  if (auth !== "none") {
    const token = await getAccessToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else if (auth === "required") {
      throw new ApiError(401, "Oturum gerekli.", "UNAUTHENTICATED");
    }
  }

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const nextOpts: { revalidate?: number | false } = {};
  if (revalidate !== undefined) nextOpts.revalidate = revalidate;

  let res: Response;
  try {
    res = await fetch(`${serverEnv.apiBaseUrl}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache,
      next: Object.keys(nextOpts).length ? nextOpts : undefined,
      signal,
    });
  } catch {
    throw new ApiError(0, "Sunucuya ulaşılamadı. Bağlantını kontrol et.", "NETWORK");
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "message" in data
        ? normalizeMessage((data as { message: unknown }).message)
        : null) ?? `İstek başarısız (${res.status}).`;
    const code =
      data && typeof data === "object" && "error" in data
        ? String((data as { error: unknown }).error)
        : undefined;
    throw new ApiError(res.status, message, code);
  }

  return data as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function normalizeMessage(message: unknown): string {
  if (Array.isArray(message)) return message.join(" ");
  if (typeof message === "string") return message;
  return "İstek başarısız.";
}

/**
 * Imagery proxy göreli URL'lerini (/vehicle-imagery/render?...) NestJS host'una
 * mutlaklaştırır. Backend API_PUBLIC_BASE_URL set etmemişse gerekli.
 */
export function absolutizeImageryUrl(url: string): string {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  const base = serverEnv.apiPublicBaseUrl || serverEnv.apiBaseUrl;
  try {
    const origin = new URL(base).origin;
    return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
  } catch {
    return url;
  }
}
