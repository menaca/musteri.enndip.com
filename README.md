# musteri.enndip.com

enndip tüketici web uygulaması — Flutter mobil uygulamasının **birebir özellik paritesine** sahip web karşılığı. Next.js 15 (App Router) + React 19 + TypeScript (strict) + Tailwind 3.4 ile yazıldı; mevcut **Supabase Auth** ve **NestJS** backend'ini **BFF (Backend-for-Frontend)** mimarisiyle güvenli şekilde tüketir.

> Detaylı dokümantasyon: [`PROJECT.md`](./PROJECT.md), [`ARCHITECTURE.md`](./ARCHITECTURE.md), [`DECISIONS.md`](./DECISIONS.md), [`CHANGELOG.md`](./CHANGELOG.md).

## Hızlı Başlangıç

```bash
cp .env.example .env.local   # değerleri doldurun
npm install
npm run dev                  # http://localhost:3000
```

Diğer scriptler:

```bash
npm run build       # production derleme
npm run start       # production sunucu
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit (strict)
```

## Ortam Değişkenleri

| Değişken | Kapsam | Açıklama |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | public | Supabase proje URL'i (tarayıcı PKCE auth). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | Supabase anon key. |
| `API_BASE_URL` | **server-only** | NestJS core API tabanı (`…/api/v1`). Token tarayıcıya inmez. |
| `API_PUBLIC_BASE_URL` | server-only | Vehicle-imagery proxy mutlak URL tabanı. Boşsa `API_BASE_URL` host'u kullanılır. |
| `NEXT_PUBLIC_SITE_URL` | public | OAuth redirect + metadata/sitemap taban URL'i. |

## Mimari Özet

- **BFF + httpOnly cookie**: Supabase oturumu `@supabase/ssr` ile httpOnly cookie'de tutulur; access token tarayıcı JS'ine **hiç düşmez**. Korumalı NestJS çağrıları yalnızca sunucu tarafında (RSC + server action + route handler) Bearer ile yapılır (`lib/api/server.ts`). Same-origin olduğundan CORS gerekmez.
- **Auth**: Google + Apple OAuth + e-posta/şifre. PKCE callback `app/auth/callback/route.ts`. Route guard'lar `middleware.ts`.
- **Tasarım sistemi**: Flutter temasıyla birebir eşlenmiş Tailwind token'ları + Plus Jakarta Sans (`next/font`). Responsive AppShell (desktop sidebar / mobil drawer).
- **PWA**: `app/manifest.ts`, SVG ikonlar (`app/icon.svg`, `app/apple-icon.svg`), offline kabuk (`public/sw.js` + `/offline`).
- **Analitik**: Web oturum/event takibi `app/api/analytics/*` proxy üzerinden NestJS'e iletilir (`platform: web`).
- **SEO**: `lang=tr`, `app/robots.ts`, `app/sitemap.ts`, OpenGraph/Twitter metadata.
- **Performans (Faz 1–3)**: Çift katmanlı cache — Next.js Data Cache (sunucu TTL) + TanStack Query (bellek). Ana sekmeler `/api/bff/*` JSON ile client shell; listing akışı `GET /catalog/models/:id/bundle` + lazy IMAGIN galeri. Detay: `ARCHITECTURE.md` §3, `CHANGELOG.md` İterasyon 5.

## Vercel Deploy

1. **Import**: Vercel → New Project → bu klasörü (`outofcontext/musteri.enndip.com`) **Root Directory** olarak seçin. Framework otomatik **Next.js** algılanır.
2. **Env**: Yukarıdaki tüm değişkenleri Production/Preview için girin.
3. **Domain**: `musteri.enndip.com` ekleyin.
4. **Supabase Auth → URL Configuration → Redirect URLs**'e ekleyin:
   - `https://musteri.enndip.com/auth/callback`
   - (preview için) `https://*.vercel.app/auth/callback`
5. **OAuth sağlayıcılar**: Google + Apple konsollarında redirect olarak Supabase callback URL'i (`https://<proje>.supabase.co/auth/v1/callback`) kayıtlı olmalı.

Bölge `fra1` (Frankfurt) olarak ayarlandı (`vercel.json`) — Railway backend'e yakınlık için.

## Sağlık Kontrolü

```
GET /api/health  →  { "status": "ok", ... }
```
