"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "enndip_session_id";

/**
 * Web analitiği — oturum başlatır ve rota değişiminde screen_view gönderir.
 * Tamamen fire-and-forget; hatalar yutulur, render asla bloklanmaz.
 */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const sessionId = useRef<string | null>(null);
  const started = useRef(false);

  // Oturumu bir kez başlat.
  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) {
      sessionId.current = existing;
      return;
    }

    const payload = {
      locale: navigator.language?.slice(0, 5) || "tr",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      osVersion: navigator.userAgent.slice(0, 60),
    };

    fetch("/api/analytics/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    })
      .then((r) => r.json())
      .then((data: { sessionId?: string | null }) => {
        if (data.sessionId) {
          sessionId.current = data.sessionId;
          sessionStorage.setItem(SESSION_KEY, data.sessionId);
        }
      })
      .catch(() => {});
  }, []);

  // Rota değişiminde screen_view.
  useEffect(() => {
    const t = setTimeout(() => {
      fetch("/api/analytics/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          events: [
            {
              sessionId: sessionId.current ?? undefined,
              eventName: "screen_view",
              screenName: pathname.slice(0, 80),
            },
          ],
        }),
        keepalive: true,
      }).catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
