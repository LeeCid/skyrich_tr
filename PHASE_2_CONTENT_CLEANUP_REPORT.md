# Phase 2 — Content Correctness + SKU Enforcement Report

## Summary
Removed fake/unverified public claims, enforced approved SKU whitelist on public endpoints, disabled fake contact form, and cleaned admin product defaults.

## Changed Files

### Frontend — Public Content
- `artifacts/skyrich-tr/src/pages/product-detail.tsx`
  - Removed hardcoded "Stokta Var" badge
  - Replaced "Bayi Bul" button with safe CTAs: "WhatsApp'tan Bilgi Al" and "Uyumluluğu Sor"
  - Fixed 0-value fallback: voltage/capacity/cca/weight/dimensions now render "Doğrulanacak" instead of "-" or "0"

- `artifacts/skyrich-tr/src/pages/home.tsx`
  - Replaced unverified claims in "Neden Skyrich?" section:
    - "%65'e kadar daha hafif" → "Hafif Lityum Teknolojisi" with neutral description
    - "4 kata kadar daha uzun ömür" → "Bakım Gerektirmeyen Kullanım" with neutral description
    - "Yüksek CCA değerleri ile anında tepki" → "Teknik Destek" with distributor support description
  - No percentages, multipliers, or unverified superiority claims remain

- `artifacts/skyrich-tr/src/pages/contact.tsx`
  - Removed fake contact form (was console.log + fake success toast)
  - Replaced with honest contact CTA cards driven from site settings
  - WhatsApp CTA links to `wa.me/` with cleaned phone number
  - Shows "İletişim bilgileri yakında eklenecek." when no settings exist

### Backend — SKU Enforcement
- `artifacts/api-server/src/routes/batteries.ts`
  - Added `APPROVED_PUBLIC_SKUS` constant with exact 12 SKUs
  - Added `isPublicApproved()` helper (active === true && modelCode in whitelist)
  - GET `/api/batteries` now filters to only active + approved SKUs
  - GET `/api/batteries/:id` returns 404 if battery is inactive or not in approved list
  - Admin mutation endpoints (POST/PATCH/DELETE) remain unrestricted for management

- `artifacts/api-server/src/routes/finder.ts`
  - Added same `APPROVED_PUBLIC_SKUS` and `isPublicApproved()`
  - GET `/api/finder/search` results now filter out unapproved/inactive batteries

### Admin Form Cleanup
- `artifacts/skyrich-tr/src/pages/admin/components/admin-batteries.tsx`
  - Removed default `voltage: 12` → now `undefined`
  - Removed default `capacity: 0` → now `undefined`
  - Removed default `cca: 0` → now `undefined`
  - Removed default `weight: 0` → now `undefined`
  - Removed AGM/GEL/JEL options from technology dropdown (V1 only Lithium)
  - Added admin note: "Teknik değerler resmi kaynak veya işletme tarafından doğrulanmadan doldurulmamalıdır."

## Removed Claims
- "Stokta Var" (fake stock)
- "%65'e kadar daha hafif" (unverified percentage)
- "4 kata kadar daha uzun ömür" (unverified multiplier)
- "Yüksek CCA değerleri ile anında tepki" (unsupported CCA superiority)
- "Mesajınız Gönderildi" fake toast (contact form was non-functional)

## Endpoints Affected
- GET `/api/batteries` — now filtered by approved SKU + active
- GET `/api/batteries/:id` — 404 for unapproved/inactive
- GET `/api/finder/search` — results filtered by approved SKU + active

## Contact Form Decision
Preferred V1: Removed fake form entirely. Replaced with WhatsApp/phone/email/address CTA cards driven from `siteSettings` database table. No backend email endpoint exists yet, so no "Mesajınız gönderildi" claim is shown.

## Remaining Issues
- No real email backend for contact form (intentionally deferred)
- Product specs must be manually populated by admin from official sources
- SEO metadata in index.html still has Replit references (Phase 4)
- robots.txt still allows all (Phase 4)

## Approved SKU Catalog
```
HJTX9-FP
HJTX14H-FP
HJTZ10S-FP
HJTZ14S-FPZ
HJTZ14S-FP
HJ51913-FP
HJTX20HQ-FP
HJTZ7S-FPZ
HJTX20CH-FP
HJ13L-FPZ
HJT9B-FP
HJT7B-FPZ
```
