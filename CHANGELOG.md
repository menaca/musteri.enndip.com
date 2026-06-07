# musteri.enndip.com — Changelog

Her iterasyonun günlüğü. Format: Yapıldı / Sırada / Kararlar.

---

## Iterasyon 1 — Proje İskelesi (2026-06-05)

### Yapıldı
- Next.js 15 (App Router) + React 19 + TypeScript strict + Tailwind 3.4 iskelesi `outofcontext/musteri.enndip.com/` altına kuruldu.
- Bağımlılıklar: `@supabase/ssr`, `@supabase/supabase-js`, next/react/tailwind toolchain.
- Yapılandırma: `next.config.ts` (image remotePatterns + security headers), `tsconfig.json` (strict + paths), `tailwind.config.ts` (Flutter token eşlemesi), `postcss`, eslint.
- Ortam: `lib/env.ts` (tipli erişim), `.env.example`, `.env.local`.
- Dokümantasyon: `PROJECT.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `CHANGELOG.md`.

### Sırada
- Tasarım sistemi (globals.css, layout, UI primitifleri, AppShell).
- Auth altyapısı (supabase client'ları, middleware, BFF fetch).

### Kararlar
- ADR-W001..W008 (bkz. DECISIONS.md).

### Notlar
- Disk doluluğu nedeniyle kurulumdan önce güvenli cache temizliği yapıldı (Xcode DerivedData + Flutter build/.dart_tool); kalıcı veri kaybı yok.

---

## Iterasyon 2 — Tasarım Sistemi & Auth Altyapısı (2026-06-05)

### Yapıldı
- `globals.css` + `app/layout.tsx` (Plus Jakarta Sans, lang=tr, metadata/viewport).
- UI primitifleri: `AppButton`/`AppLinkButton`, `AppTextField`, `Shimmer`, `RemoteImage` (next/image), `Spinner`, `SectionHeader`, `Toast`, `EmptyState`, `Avatar`, `Logo`, `Icons`.
- Responsive AppShell: desktop sidebar / mobil drawer (`shell-chrome`, `sidebar-content`, `app-shell`, `page-header`, `back-bar`).
- Auth altyapısı: `lib/supabase/{client,server,middleware}.ts`, `middleware.ts` (session refresh + route guard + onboarding), guest cookie, BFF `lib/api/server.ts` (Bearer server-side), `lib/api/{types,endpoints,queries}.ts`.

### Kararlar
- ADR-W001..W008 (DECISIONS.md).

---

## Iterasyon 3 — Ekranlar (Auth → İkincil) (2026-06-05)

### Yapıldı
- **Auth ekranları**: onboarding, login, register, password-reset, signup-verify, auth-link-error, `/auth/callback` (PKCE); Google + Apple + e-posta/şifre, KVKK onayı, guest mode.
- **Home**: `GET /home/feed` (RSC) → brand strip, Aktif İlanlarım, Dealer CTA, ad slider, kategori grid + `loading.tsx`.
- **Aracını Bulalım**: 4 adımlı wizard (marka→seri→paket→motor), URL query state, `/api/catalog/*` route handler'ları.
- **İlan akışı**: vehicle-options (galeri + 360 spin + renk + panel-spec), summary, offer (ücret kartı + `POST /listings` + ödeme başarı sheet, guest→login).
- **Hesabım** (`GET/PATCH /users/me`), **İlanlarım** (Tümü/Aktif/Geçmiş filtre + `DELETE /listings/:id`).
- **İkincil**: Tercihler (local persist), Bildirimler (mock), Enndipten Al (statik), İletişim, Nasıl Çalışır.

### Kararlar
- ADR-W001..W008 (DECISIONS.md).

---

## Iterasyon 4 — Analitik, PWA, SEO, Deploy (2026-06-05)

### Yapıldı
- **Analitik**: `/api/analytics/{session,events}` BFF proxy (optional-auth, fire-and-forget); `AnalyticsTracker` oturum + rota bazlı `screen_view`. `platform: web`. Backend: `StartSessionDto` enum + migration `057_app_platform_web.sql`.
- **PWA**: `app/manifest.ts`, `app/icon.svg` + `app/apple-icon.svg` + `public/icon-maskable.svg`, offline kabuk (`public/sw.js` + `app/offline`, `ServiceWorkerRegister`).
- **SEO/perf**: `app/robots.ts`, `app/sitemap.ts`, OpenGraph/Twitter metadata, `lang=tr`; RSC streaming + revalidate cache + next/image.
- **Deploy**: `vercel.json` (fra1 + sw/manifest header'ları), `README.md` (env tablosu + Vercel & Supabase redirect adımları), `/api/health`.
- **Doğrulama**: `npm run typecheck` ✓, `npm run build` ✓ (33 route).

### Sırada
- Vercel import + env + domain; Supabase Redirect URLs; Apple Sign-In web (Services ID); migration `057` uygula.

### Kararlar
- ADR-013, ADR-014 (kök `outofcontext/DECISIONS.md`).

---

## Iterasyon 5 — Performans: Cache, TanStack Query, Listing Bundle (2026-06-05)

### Yapıldı

#### UX — Sayfa iskeletleri
- Her ana rota için özel `loading.tsx` shimmer (anasayfa, ilanlarım, hesabım, araç bul, listing akışı, tercihler, bildirimler, vb.).
- `components/skeletons/` — ortak `PageShell`, `PageHeaderSkeleton`, sayfa bazlı iskeletler.

#### Faz 1 — Sunucu tarafı hız (güvenlik korunarak)
- `React.cache()` ile auth dedupe: `getServerAuth()` — istek başına tek Supabase `getUser` + `getSession`.
- Layout streaming: `AppShell` sayfa içeriğini auth beklemeden render; sidebar kimliği ayrı `Suspense`.
- Kişisel veri Next.js Data Cache TTL: home 30s, ilanlar 60s, profil 120s (`no-store` kaldırıldı); mutasyonlarda `revalidatePath` korundu.
- Backend JWT `profile.role` sorgusu 5 dk in-memory cache (`jwt.strategy.ts`).
- Audit log: `X-App-Source: musteri_portal` → admin panel **web-musteri** etiketi.
- IMAGIN: Türkçe seri adları → `e-class` / `g-class` eşlemesi (`resolveImaginModelFamily`).

#### Faz 2 — Bellek cache + BFF JSON (sekme anında açılma)
- `@tanstack/react-query` + `QueryProvider` (`(app)/layout`).
- Same-origin BFF JSON: `/api/bff/{session,home,listings,me,brands,series}` — token sunucuda kalır.
- Ana sekmeler client shell: Anasayfa, İlanlarım, Hesabım, Araç Bul (`*-page-client.tsx`).
- Idle prefetch (`NavPrefetcher`) + sidebar hover prefetch (`NavLink`).
- Mutasyon sonrası `invalidateUserData()` (ilan iptal, profil güncelle, ilan yayınla).

#### Faz 3 — Listing akışı optimizasyonu
- Backend: `GET /catalog/models/:modelId/bundle` — detay + panel spec + renkler tek round-trip.
- Web BFF: `/api/bff/models/[modelId]/bundle` + `useModelBundle()` (30 dk stale).
- `vehicle-options` / `summary` / `offer` → client shell; SSR galeri bloklaması kaldırıldı.
- `VehicleOptions`: preview anında; tam IMAGIN galeri mount'ta arka planda lazy yüklenir.
- `buildListingHeroFromBundle` — summary/offer galeri beklemez.
- Motor seçiminde `prefetchModelBundle` (araç bul → vehicle-options).

### Sırada
- Faz 1.5 infra: Railway cold start kapalı, Vercel + Railway aynı bölge.
- Faz 4 (opsiyonel): Redis, PPR, Service Worker API stale-while-revalidate.

### Kararlar
- ADR-W009, ADR-W010, ADR-W011 (DECISIONS.md).

### Doğrulama
- `npm run typecheck` ✓ (musteri.enndip.com + backend).
