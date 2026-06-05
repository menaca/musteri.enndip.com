# musteri.enndip.com — Architecture Decision Records (ADR)

Kararların gerekçesi burada yaşar. Karar değişirse eskisi "Superseded" işaretlenir. Silme yok.

---

## ADR-W001 — Framework: Next.js 15 App Router

- **Tarih**: 2026-06-05
- **Durum**: Accepted
- **Bağlam**: Tüketici web app için SSR/RSC, SEO, Vercel uyumu ve mevcut panellerle (main-page, admin-panel Next 15) tutarlılık gerekli.
- **Karar**: Next.js 15 App Router + React 19 + TypeScript strict + Tailwind 3.4.
- **Gerekçe**: RSC ile server-side veri çekimi (BFF güvenliği), streaming ile hızlı algı, Vercel first-class destek, mevcut ekip stack'i.
- **Alternatifler**: Vite SPA (call-center-panel) — SEO/SSR ve güvenli token saklama zayıf; reddedildi.

## ADR-W002 — Veri Mimarisi: BFF + httpOnly Cookie

- **Tarih**: 2026-06-05
- **Durum**: Accepted
- **Bağlam**: NestJS API JWT (Bearer) bekliyor. Token'ı tarayıcıda tutmak (localStorage/JS) XSS riski; doğrudan tarayıcı→NestJS CORS gerektirir.
- **Karar**: BFF. Supabase oturumu `@supabase/ssr` ile httpOnly cookie'de; tüm NestJS çağrıları Next.js sunucusundan Bearer ile yapılır. Tarayıcı yalnız same-origin Next + Supabase Auth ile konuşur.
- **Gerekçe**: Token client JS'ine inmez (XSS'e dayanıklı), CORS yüzeyi yok, backend CORS_ORIGINS'e dokunmaya gerek yok, sektör standardı.
- **Trade-off**: Veri çağrıları server'dan geçer (ekstra hop). RSC + cache ile absorbe edilir.

## ADR-W003 — Auth: Supabase Auth Korunur (mobil ile aynı)

- **Tarih**: 2026-06-05
- **Durum**: Accepted
- **Bağlam**: Mobil Supabase Auth (email/şifre + Google + Apple) kullanıyor. Web aynı kullanıcı tabanını paylaşmalı.
- **Karar**: Supabase Auth + `@supabase/ssr` (PKCE). Google + Apple + email/şifre. `/auth/callback` code exchange.
- **Gerekçe**: Aynı kullanıcı havuzu, hazır email/OAuth altyapısı, refresh rotation.
- **Trade-off**: Apple web için Service ID + domain doğrulaması gerekir (kullanıcı sağlayacak).

## ADR-W004 — Tasarım Sistemi: Flutter token'ları + main-page görsel dili

- **Tarih**: 2026-06-05
- **Durum**: Accepted
- **Karar**: Tailwind token'ları Flutter `app_colors/typography/spacing` ile birebir; Plus Jakarta Sans; pill buton + ink/paper + açık gri kart. shadcn kullanılmaz (hafif, custom).
- **Gerekçe**: Mobil ile birebir görsel tutarlılık; enndip.com (main-page) ile aynı dil; minimum bağımlılık.

## ADR-W005 — Layout: Responsive (sidebar/drawer)

- **Tarih**: 2026-06-05
- **Durum**: Accepted
- **Bağlam**: Mobil drawer-tabanlı, bottom nav yok. Web masaüstünde alan geniş.
- **Karar**: `lg+` kalıcı sol sidebar (drawer içeriği), `lg-` hamburger + açılır drawer. Home/katalog masaüstünde geniş grid; auth/onboarding dar konteyner.
- **Gerekçe**: Masaüstü ergonomisi + mobil tasarım dilini koruma.

## ADR-W006 — Stub'lar mobil ile bire bir

- **Tarih**: 2026-06-05
- **Durum**: Accepted
- **Karar**: Bildirimler (mock), Enndipten Al (statik örnek veri), teklif inceleme (stub), ödeme (gerçek gateway yok, başarı sheet) — mobildeki davranış birebir taşınır.
- **Gerekçe**: "Tam dönüşüm" hedefi; backend bu özellikleri henüz sunmuyor (501/yok). İleride backend gelince gerçeklenir.

## ADR-W007 — Analytics: backend 'web' platform eklendi

- **Tarih**: 2026-06-05
- **Durum**: Accepted
- **Bağlam**: `StartSessionDto.platform` enum yalnız `ios|android`. Web oturum/event analitiği için `web` gerekli.
- **Karar**: Backend `analytics` DTO platform enum'una geriye-uyumlu `web` eklenir; web app oturum/event gönderir.
- **Gerekçe**: Mobil analitik paritesi; geriye-uyumlu (mevcut değerler korunur).

## ADR-W008 — PWA

- **Tarih**: 2026-06-05
- **Durum**: Accepted
- **Karar**: `app/manifest.ts` + ikonlar + theme color; standalone display.
- **Gerekçe**: Mobil tarayıcıda "ana ekrana ekle", hızlı tekrar yükleme, uygulama hissi.
