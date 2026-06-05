# musteri.enndip.com — Proje Master Context

enndip tüketici (müşteri) web uygulaması. Flutter mobil uygulamasının (`enndip/lib`) tam web karşılığıdır. Aynı tasarım dili, aynı backend (NestJS + Supabase), aynı kullanıcı akışları.

Bu dosya kalıcı proje hafızasıdır. Derinlik için `ARCHITECTURE.md`, kararlar için `DECISIONS.md`, günlük için `CHANGELOG.md`.

---

## 1. Ürün

**enndip** — sıfır araçlarda tersine açık artırma (reverse auction) pazaryeri. Kullanıcı sıfır araç için ilan açar; bayiler en düşük fiyatı vermek için teklif yarıştırır. Bu web app, mobil uygulamadaki tüketici deneyiminin (browse, ilan oluşturma, hesap) masaüstü + mobil tarayıcı karşılığıdır.

Slogan: "Sıfır araçta en uygun fiyatlar enndip.com'da"

## 2. Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 15 (App Router) + React 19 |
| Dil | TypeScript (strict) |
| Stil | Tailwind CSS 3.4 (token'lar Flutter temasıyla birebir) |
| Font | Plus Jakarta Sans (`next/font/google`) |
| Auth | Supabase Auth (`@supabase/ssr`, httpOnly cookie / PKCE) |
| Veri | NestJS Core API (`/api/v1`) — **BFF üzerinden, server-side** |
| Görsel | NestJS vehicle-imagery HMAC proxy + `next/image` |
| Hosting | Vercel (`musteri.enndip.com`) |

## 3. Mimari Özeti (BFF)

```
Tarayıcı ──same-origin──► Next.js (Vercel) ──Bearer JWT──► NestJS (/api/v1) ──► Supabase Postgres
   │                          │
   │                          └──@supabase/ssr (httpOnly cookie)──► Supabase Auth
   └──OAuth redirect (Google/Apple)──► Supabase Auth ──► /auth/callback
```

- **Güvenlik çekirdeği**: access token tarayıcı JS'ine HİÇ düşmez. Tüm korumalı API çağrıları Next.js sunucusundan (RSC / server action / route handler) yapılır; token cookie'den okunup Bearer olarak eklenir.
- **Guest mod**: ephemeral cookie (`enndip_guest`). Public/optional-auth endpoint'ler token'sız çalışır.
- Detay: `ARCHITECTURE.md`.

## 4. Ekran Envanteri (mobil → web, hepsi)

| Web rotası | Mobil karşılığı | Auth | Veri kaynağı |
|------------|------------------|------|--------------|
| `/onboarding` | onboarding | public | `GET /onboarding/slide` |
| `/login` `/register` `/password-reset` `/signup-verify` `/auth-link-error` | auth | public | Supabase Auth |
| `/auth/callback` | deep link | public | PKCE code exchange |
| `/` (home) | home | guest+ | `GET /home/feed` |
| `/find-car` | find_car | guest+ | `GET /catalog/*` |
| `/listing/vehicle-options` `/listing/summary` `/listing/offer` | post_selection | guest+ (publish: auth) | `catalog`, `vehicle-imagery`, `POST /listings` |
| `/account` | account | auth | `GET/PATCH /users/me` |
| `/my-listings` | my_listings | auth | `GET /listings`, `DELETE /listings/:id` |
| `/preferences` | settings/preferences | guest+ | localStorage |
| `/notifications` | settings/notifications | guest+ | mock (mobille aynı) |
| `/buy-from-enndip` | buy_now | guest+ | statik örnek veri (mobille aynı) |
| `/contact` `/how-it-works` | info | guest+ | statik |

## 5. Çalışma Prensipleri

1. **Mobil tek doğru kaynak** — UI/akış için `enndip/lib` + `outofcontext/screenshots`. Şüphede kullanıcıya sor.
2. **Tasarım token'ları sabit** — Flutter `app_colors/typography/spacing` ile birebir. Hard-code renk yok; Tailwind token kullan.
3. **Güvenlik** — token asla client'a inmez; tüm API çağrıları server-side.
4. **Performans** — RSC + streaming + skeleton; kasma/donma hissi yok.
5. **Stub'lar mobille aynı** — bildirim/enndipten al/ödeme mobildeki davranışı birebir taşır.
6. **Her iterasyon sonrası `CHANGELOG.md`**; karar değişince `DECISIONS.md`'ye ADR.

## 6. Referanslar

- `ARCHITECTURE.md` — katmanlar, BFF data-flow, klasör yapısı, güvenlik.
- `DECISIONS.md` — ADR'ler.
- `CHANGELOG.md` — iterasyon günlüğü.
- Üst proje: `../PROJECT.md`, `../ARCHITECTURE.md`, `../DECISIONS.md`.
- Backend API: `../../backend` (NestJS). Mobil: `../../lib` (Flutter).
