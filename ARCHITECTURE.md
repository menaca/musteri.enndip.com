# musteri.enndip.com — Technical Architecture

Derin teknik rehber. Yüzeysel özet için `PROJECT.md`.

---

## 0. Üst Düzey

```
Tarayıcı (React 19)
   │  same-origin (RSC payload / server action / route handler)
   ▼
Next.js 15 (Vercel)
   ├── @supabase/ssr  ── httpOnly cookie ──►  Supabase Auth (PKCE)
   ├── lib/api/server ── Bearer JWT ────────►  NestJS Core API (/api/v1, Railway)
   └── next/image     ── HMAC token URL ────►  vehicle-imagery proxy
                                                     │ Prisma
                                                     ▼
                                              Supabase Postgres
```

**İlke**: Tarayıcı yalnızca Supabase Auth ile (anon key, PKCE) konuşur ve same-origin Next.js sunucusuyla. NestJS'e doğrudan tarayıcıdan istek **gitmez** → access token client'a sızmaz, CORS yüzeyi yok.

---

## 1. Katmanlar ve Klasör Yapısı

```
musteri.enndip.com/
├── app/
│   ├── layout.tsx              # root layout, font, metadata, Providers
│   ├── globals.css             # tailwind + component class'ları
│   ├── manifest.ts             # PWA manifest
│   ├── icon.tsx / apple-icon.tsx (PWA ikon, opsiyonel)
│   ├── (auth)/                 # kimlik dışı dar layout
│   │   ├── layout.tsx
│   │   ├── onboarding/page.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── password-reset/page.tsx
│   │   ├── signup-verify/page.tsx
│   │   └── auth-link-error/page.tsx
│   ├── auth/callback/route.ts  # PKCE code → cookie, sonra yönlendirme
│   ├── (app)/                  # AppShell (sidebar/drawer) ile sarılı
│   │   ├── layout.tsx
│   │   ├── page.tsx            # / (home)
│   │   ├── find-car/page.tsx
│   │   ├── listing/
│   │   │   ├── vehicle-options/page.tsx
│   │   │   ├── summary/page.tsx
│   │   │   └── offer/page.tsx
│   │   ├── account/page.tsx
│   │   ├── my-listings/page.tsx
│   │   ├── preferences/page.tsx
│   │   ├── notifications/page.tsx
│   │   ├── buy-from-enndip/page.tsx
│   │   ├── contact/page.tsx
│   │   └── how-it-works/page.tsx
│   └── api/
│       ├── health/route.ts
│       └── analytics/route.ts  # web analytics passthrough (opsiyonel)
├── components/
│   ├── ui/                     # AppButton, AppTextField, Card, Shimmer, RemoteImage, ...
│   ├── layout/                 # AppShell, Sidebar, MobileDrawer, TopBar, BackBar
│   ├── home/                   # BrandStrip, ActiveListings, DealerCta, AdSlider, CategoryGrid
│   ├── find-car/               # StepChips, SelectionList, ...
│   ├── listing/                # Gallery, SpinViewer, ColorStrip, PanelSpec, FeeCard, SuccessSheet
│   └── auth/                   # AuthForm parçaları, SocialSignIn, KvkkConsent
├── lib/
│   ├── env.ts                  # tipli env erişimi
│   ├── supabase/
│   │   ├── client.ts           # createBrowserClient (auth state, OAuth başlat)
│   │   ├── server.ts           # createServerClient (RSC/action, cookie)
│   │   └── middleware.ts       # session refresh helper
│   ├── api/
│   │   ├── server.ts           # BFF fetch: token cookie'den → Bearer
│   │   ├── endpoints.ts        # endpoint path sabitleri
│   │   └── types.ts            # API DTO TypeScript tipleri
│   ├── actions/                # "use server" mutasyonları (listing, profile)
│   ├── auth/guest.ts           # guest cookie yönetimi
│   ├── format.ts               # tr-TR tarih/sayı/para formatı
│   └── utils.ts                # cn() vb.
├── middleware.ts               # oturum yenile + rota guard
└── public/                     # ikonlar, statik görseller
```

### Katman sorumlulukları
- **app (RSC)**: veri çekme (server-side), sayfa kompozisyonu, streaming/Suspense.
- **components/ui**: tasarım sistemi primitifleri (çoğu server component; etkileşimli olanlar `"use client"`).
- **lib/api**: NestJS sözleşmesi tek noktada; tipler `types.ts`.
- **lib/supabase**: üç client (browser/server/middleware) — `@supabase/ssr` paterni.
- **lib/actions**: write işlemleri (publish listing, profile update) — server action.

---

## 2. Auth Akışı

### 2.1 Client'lar (`@supabase/ssr`)
- **browser** (`lib/supabase/client.ts`): yalnızca login/signup/OAuth başlatma ve `onAuthStateChange`. Token cookie'ye `@supabase/ssr` tarafından yazılır.
- **server** (`lib/supabase/server.ts`): RSC ve server action'larda `getUser()` / oturum okuma.
- **middleware** (`lib/supabase/middleware.ts` + kök `middleware.ts`): her istekte oturumu yeniler (token refresh) ve guard uygular.

### 2.2 E-posta/Şifre
`supabase.auth.signInWithPassword` (browser) → cookie set → `router.refresh()` → middleware authenticated görür → korumalı rotalar açılır.

### 2.3 Sosyal (Google + Apple)
`supabase.auth.signInWithOAuth({ provider, options: { redirectTo: SITE_URL + '/auth/callback?next=...' } })`. Apple için Supabase'de Apple provider (Service ID + key) yapılandırılmalı (kullanıcı sağlayacak). `/auth/callback` PKCE `exchangeCodeForSession` ile cookie kurar, sonra `next`'e yönlendirir. OAuth sonrası `PATCH /users/me` ile ad/avatar senkronu (mobille aynı).

### 2.4 Doğrulama & Şifre Sıfırlama
- Register → `signUp({ emailRedirectTo: /auth/callback })` → `/signup-verify`.
- Şifre sıfırlama → `resetPasswordForEmail({ redirectTo })`.
- E-posta link hatası → `/auth-link-error`.

### 2.5 Guard (kök `middleware.ts`)
| Durum | Davranış |
|-------|----------|
| auth gerekli rota (`/account`, `/my-listings`) + oturum yok + guest değil | `/login?redirectTo=` |
| public auth rotası (`/login` vb.) + oturumlu | `/` |
| diğer (home, find-car, listing, info) | geçer (guest dahil) |
Her durumda middleware Supabase oturumunu yeniler (cookie tazeler).

---

## 3. Veri Erişimi (BFF)

`lib/api/server.ts` tek giriş noktası:
1. `createServerClient().auth.getSession()` ile access token okunur (varsa).
2. `fetch(API_BASE_URL + path, { headers: { Authorization: Bearer? }, next: { revalidate } })`.
3. NestJS hata zarfı (`{ statusCode, error, message }`) tipli `ApiError`'a çevrilir.
4. Public endpoint'ler token'sız da çalışır (guest).

Cache stratejisi:
- Katalog (brands/series/trims/engines, kategoriler): `revalidate` ile ISR benzeri cache.
- Home feed: kısa `revalidate` (kullanıcıya özel ise `no-store`).
- Kullanıcıya özel (`/users/me`, `/listings`): `no-store`.

Write'lar `lib/actions/*` server action'larından; başarıda `revalidatePath`.

---

## 4. Tasarım Sistemi

Token kaynağı: Flutter `lib/app/theme/*` (`tailwind.config.ts` içinde birebir).
- Renk: `ink #0B0B0B`, `paper #FFFFFF`, `cream #F4F4F4`, `sand #EFEFEF`, `card #F6F6F6`, `line #E5E5E5`, `accent #3C8A4A`, `danger #D13B3B`, `success #2BA463`, `warning #E8A23B`, `link #1A73E8`.
- Tipografi: Plus Jakarta Sans; display/heading/body/label ölçekleri `globals.css` + util.
- Radius: pill butonlar, 12-28px kartlar. Spacing: 4pt.
- Component class'ları: `.btn-primary` (siyah pill), `.btn-ghost`, `.card-soft`, `.container-x`, `.eyebrow`.

### Responsive Layout
- **AppShell**: `lg` ve üstü → kalıcı sol sidebar (drawer içeriği). `lg` altı → üstte hamburger + açılır drawer (mobil `sidebar.png` davranışı).
- Home/katalog/ilanlar masaüstünde geniş grid; auth/onboarding dar ve ortalanmış konteyner (`(auth)/layout`).

---

## 5. Performans

- RSC ile veri server'da; client JS minimum.
- Route bazlı `loading.tsx` skeleton (shimmer) → kasma hissi yok.
- `next/image` (avif/webp) + remotePatterns (supabase, imagery host).
- `<Link>` prefetch, `Suspense` ile parçalı streaming.
- Katalog `fetch` revalidate cache → tekrar ziyaret hızlı.

---

## 6. PWA

`app/manifest.ts` (ad, ikon, theme `#0B0B0B`, display standalone). Offline kabuk için minimal yaklaşım (Next.js statik asset + manifest). Service worker gerekirse ileride eklenir.

---

## 7. Güvenlik Notları

- Token httpOnly cookie; XSS ile çalınamaz.
- Security header'ları `next.config.ts` (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`).
- Server action'lar Next.js CSRF korumalı.
- Service role key **kullanılmaz** (admin-panel'den farklı olarak); tüm yetki NestJS + Supabase Auth'ta.
- Env: yalnızca `NEXT_PUBLIC_*` tarayıcıya gider; `API_BASE_URL` server-only.
