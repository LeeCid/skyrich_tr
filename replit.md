# Skyrich Battery TR

Türkiye resmi distribütörü Skyrich Battery için Türkçe kurumsal web sitesi ve admin paneli.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — API server çalıştır (port 8080)
- `pnpm --filter @workspace/skyrich-tr run dev` — Frontend çalıştır (port 23582)
- `pnpm run typecheck` — Tüm paketlerde typecheck
- `pnpm run build` — typecheck + build
- `pnpm --filter @workspace/api-spec run codegen` — OpenAPI'dan hook ve şema üret
- `pnpm --filter @workspace/db run push` — DB şema değişikliklerini uygula (dev only)
- Required env: `DATABASE_URL` — Postgres bağlantı dizisi

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind + shadcn/ui + Framer Motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (zod/v4), drizzle-zod
- API codegen: Orval (OpenAPI spec'ten)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — Tüm API sözleşmelerinin tek kaynağı
- `lib/db/src/schema/` — Drizzle ORM şema tanımları (batteries, banners, popups)
- `artifacts/api-server/src/routes/` — API route'ları
- `artifacts/skyrich-tr/src/` — Frontend React uygulaması
- `lib/api-client-react/src/generated/` — Üretilmiş React Query hook'ları

## Product

- **Ana Sayfa (/)**: Banner carousel, öne çıkan ürünler, teknoloji özellikleri, popup sistemi
- **Ürünler (/urunler)**: 12 akü modeli, filtreleme/arama
- **Ürün Detayı (/urunler/:id)**: Teknik specs tablosu
- **Hakkımızda (/hakkimizda)**: Marka ve Türk distribütör bilgisi
- **İletişim (/iletisim)**: İletişim formu
- **Admin (/admin)**: Şifre korumalı giriş
- **Admin Panel (/admin/panel)**: Akü/banner/popup tam CRUD yönetimi

## Akü Modelleri (12 adet)

HJTX9-FP, HJTX14H-FP, HJTZ10S-FP, HJTZ14S-FPZ, HJTZ14S-FP, HJ51913-FP,
HJTX20HQ-FP, HJTZ7S-FPZ, HJTX20CH-FP, HJ13L-FPZ, HJT9B-FP, HJT7B-FPZ

## Architecture decisions

- OpenAPI-first: Tüm API endpoint'leri lib/api-spec/openapi.yaml'da tanımlanır, codegen ile hook ve şemalar üretilir
- Admin auth: localStorage'da token tutulur; şifre ve API token backend ortam değişkenleri (ADMIN_PASSWORD, ADMIN_API_TOKEN) ile belirlenir
- Frontend tamamen Türkçe, admin paneli de Türkçe
- Popups: showOnce mantığı localStorage ile yönetilir, delaySeconds sonra gösterilir
- Banners: API'dan çekilir, ana sayfada carousel olarak gösterilir

## User preferences

- Site tamamen Türkçe
- Sadece faturadaki 12 akü model kodu ürünlerde gösterilecek
- Admin panelden: akü, banner ve popup yönetimi yapılabilmeli
- İleride: yeni akü modeli ve görsel ekleme admin panelden yapılacak
- Admin şifresi ve API token ortam değişkenleriyle yapılandırılmalıdır

## Gotchas

- codegen'dan sonra mutlaka `pnpm run typecheck:libs` çalıştır
- DB şema değişikliklerinden sonra `pnpm --filter @workspace/db run push` gerekli
- Frontend workflow'u yeniden başlatmadan önce design subagent bitmeli

## Pointers

- Akü görselleri şu an generate_image ile üretildi; gerçek ürün görselleri admin panelden URL ile eklenebilir
- Banner görselleri admin panelden imageUrl alanı ile güncellenebilir
