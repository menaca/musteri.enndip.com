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

## ADR-W009 — Performans Faz 1: Sunucu cache + auth dedupe

- **Tarih**: 2026-06-05
- **Durum**: Accepted
- **Bağlam**: Sekme geçişleri 10+ sn; her istekte tekrarlı Supabase auth ve `no-store` fetch.
- **Karar**:
  - `React.cache()` ile `getServerAuth()` — layout + BFF tek Supabase çağrısı.
  - Layout `Suspense`: sayfa içeriği kimlik beklemeden stream.
  - Kişisel GET'ler `revalidate` TTL (Bearer başına ayrı Data Cache girişi).
  - Backend JWT validate'de `profile.role` 5 dk bellek cache.
- **Gerekçe**: Güvenlik modeli değişmeden (httpOnly cookie) sunucu hop sayısı ve DB yükü azalır.
- **Trade-off**: Kişisel veri en fazla TTL kadar gecikmeli görünür; mutasyonlarda `revalidatePath` + Faz 2 invalidation ile telafi.

## ADR-W010 — Performans Faz 2: TanStack Query + BFF JSON

- **Tarih**: 2026-06-05
- **Durum**: Accepted
- **Bağlam**: RSC-only navigasyonda sekme hafızası yok; her tıklama sunucu round-trip.
- **Karar**:
  - `@tanstack/react-query` bellek cache (stale-while-revalidate).
  - Tarayıcı yalnızca `/api/bff/*` JSON çağırır; NestJS Bearer hâlâ sunucuda (`lib/api/server.ts`).
  - Ana sekmeler client shell + `useQuery`; idle + hover prefetch.
- **Gerekçe**: Gmail/Linear/Instagram web modeli — önce cache'ten anında render, arka planda tazeleme. Token client'a inmez.
- **Alternatifler**: localStorage token + doğrudan API (reddedildi — XSS). Tam SPA (reddedildi — SEO/RSC kaybı).

## ADR-W011 — Performans Faz 3: Model bundle + lazy galeri

- **Tarih**: 2026-06-05
- **Durum**: Accepted
- **Bağlam**: `vehicle-options` 3 paralel + sıralı galeri fetch; summary/offer tekrarlı IMAGIN çağrısı.
- **Karar**:
  - Backend `GET /catalog/models/:id/bundle` (detay + panel spec + renkler; tam galeri yok).
  - Listing sayfaları client + `useModelBundle`; preview anında, galeri client lazy.
  - Motor seçiminde bundle prefetch.
- **Gerekçe**: Waterfall kırılır; ilk paint 1–2 sn hedefi. Tam galeri UX'i korunur (arka plan yükleme).
- **Trade-off**: Bundle'da preview URL'leri `getModelDetail` üzerinden gelir (tek IMAGIN resolve); renk değişiminde galeri hâlâ `/api/imagery/gallery`.
