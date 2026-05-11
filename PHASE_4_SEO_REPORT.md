# Phase 4 — SEO, Robots, Sitemap, Structured Data Report

## Summary
Cleaned up index.html metadata, added robots.txt with admin disallow, created dynamic sitemap.xml endpoint, and added JSON-LD structured data to key pages.

## Changed Files

### Frontend
- `artifacts/skyrich-tr/index.html`
  - Changed `lang="en"` → `lang="tr"`
  - Removed all "built on Replit" / generic placeholder text
  - Title: "Skyrich Battery Türkiye — Lityum Akü Distribütörü"
  - Description: "Skyrich lityum akülerinin Türkiye distribütörü. Powersport araçlar için hafif, bakım gerektirmeyen lityum iyon akü teknolojisi."
  - Added canonical URL: `https://www.skyrichbattery.com.tr/`
  - Added OG tags: title, description, type, url, image
  - Added Twitter card tags

- `artifacts/skyrich-tr/public/robots.txt`
  - Disallow: `/admin` and `/admin/panel`
  - Allow: all public pages
  - Sitemap reference: `https://www.skyrichbattery.com.tr/sitemap.xml`

- `artifacts/skyrich-tr/src/pages/home.tsx`
  - Added Organization JSON-LD structured data via useEffect
  - Includes: name, url, logo, description

- `artifacts/skyrich-tr/src/pages/product-detail.tsx`
  - Added Product JSON-LD structured data via useEffect
  - Safe fields only: name, image, description, brand (Skyrich), sku (modelCode)
  - No price, availability, or review fields (avoids unverified claims)

### Backend
- `artifacts/api-server/src/routes/batteries.ts`
  - Added GET `/api/sitemap.xml` endpoint
  - Generates XML sitemap with static pages + approved active products
  - Static URLs: /, /urunler, /aku-bulucu, /hakkimizda, /iletisim
  - Product URLs: `/urunler/{id}` for each approved active battery
  - Sets `Content-Type: application/xml`

## Admin Noindex
- Already handled in `App.tsx`: admin routes wrapped with `<meta name="robots" content="noindex, nofollow" />`

## SPA Caveats
- Canonical URLs are set in index.html as a best-effort baseline
- For a true canonical-per-page setup, server-side rendering or a meta-tag manager would be needed
- JSON-LD is injected client-side via useEffect; search engines that execute JS will pick it up

## Remaining SEO Items
- og:image requires an actual image at `/images/og-default.png`
- Server-side rendering would improve crawlability for non-JS bots
