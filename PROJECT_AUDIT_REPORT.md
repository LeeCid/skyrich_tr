# PROJECT AUDIT REPORT — Skyrich Battery TR

**Audit Date:** 2026-05-11
**Auditor:** Production-readiness auditor
**Scope:** Full codebase inspection (no code changes made)
**Project Path:** `c:\Users\Irmak\Desktop\Skyrich_TR`

---

## 1. Project Architecture

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Frontend** | React 19 SPA, Vite 7, Tailwind CSS 4, shadcn/ui, wouter (routing), TanStack Query | No SSR. Single-page app. |
| **Backend/API** | Express 5, esbuild-bundled ESM, Pino HTTP logging | Standalone Node.js server |
| **Database** | PostgreSQL 16, Drizzle ORM, `drizzle-zod` validation | `DATABASE_URL` required |
| **Auth** | Custom token in `localStorage`, static hardcoded token on backend | No JWT library, no bcrypt, no session middleware |
| **API Generation** | OpenAPI-first (`lib/api-spec/openapi.yaml`), Orval codegen | Hooks/schemas auto-generated from spec |
| **Deployment target** | Currently Replit-native; intended target is **Vercel** | Replit-specific config and plugins present |

### Routing Structure (Frontend SPA)
- `/` — Homepage (hero carousel, featured products, popup, tech highlights)
- `/urunler` — Product listing with search + category filter
- `/urunler/:id` — Product detail page
- `/aku-bulucu` — Battery finder (vehicle make/model/year → compatible battery)
- `/hakkimizda` — About page
- `/iletisim` — Contact page (form only, no backend submission)
- `/admin` — Admin login
- `/admin/panel` — Admin dashboard (tabs: batteries, banners, popups, site settings, hero, pages)

### Backend API Routes (`/api/*`)
- `GET/POST/PATCH/DELETE /api/batteries` — Full battery CRUD (no auth middleware)
- `GET/POST/PATCH/DELETE /api/banners` — Banner CRUD (no auth middleware)
- `GET/POST/PATCH/DELETE /api/popups` — Popup CRUD (no auth middleware)
- `GET/PUT /api/site-settings` — Site settings (no auth middleware)
- `GET/PUT /api/hero-settings` — Hero settings (no auth middleware)
- `GET/PUT /api/page-contents/:key` — Page content editor (no auth middleware)
- `GET/POST /api/vehicle-compatibility` — Compatibility data (no auth middleware)
- `GET /api/finder/*` — Public battery finder endpoints
- `POST /api/admin/login` — Admin login
- `GET /api/admin/stats` — Dashboard stats (no auth middleware)
- `GET /api/healthz` — Health check

### Environment Variables Used
- `DATABASE_URL` — Required by `lib/db/src/index.ts`
- `PORT` — Required by `artifacts/api-server/src/index.ts` and `artifacts/skyrich-tr/vite.config.ts`
- `BASE_PATH` — Required by `vite.config.ts`
- `ADMIN_PASSWORD` — Optional fallback in `api-server/src/routes/admin.ts` (defaults to hardcoded value)
- `NODE_ENV` — Checked in Vite config for Replit plugin gating
- `REPL_ID` — Checked in Vite config for Replit plugin gating

---

## 2. File Inventory

### Root / Workspace
| File | Purpose |
|------|---------|
| `package.json` | Workspace root; defines `build`, `typecheck` scripts; devDeps: TypeScript, Prettier |
| `pnpm-workspace.yaml` | pnpm workspace config with catalog versions, supply-chain security settings, platform overrides for esbuild/lightningcss/rollup (Replit/Linux-x64 focused) |
| `tsconfig.base.json` | Shared TS config |

### Frontend (`artifacts/skyrich-tr/`)
| File | Purpose |
|------|---------|
| `package.json` | Frontend deps: React, Vite, Tailwind, Radix/shadcn, wouter, TanStack Query, Framer Motion, etc. |
| `vite.config.ts` | Vite config with **required `PORT` and `BASE_PATH` env vars**; Replit-specific plugins (cartographer, devBanner, runtimeErrorOverlay) |
| `index.html` | HTML entry point; contains hardcoded generic meta description referencing "built on Replit" |
| `src/main.tsx` | React root mount |
| `src/App.tsx` | Router setup with wouter; wraps public pages in Layout (Navbar + Footer); admin routes are unwrapped |
| `src/index.css` | Tailwind 4 theme definition; dark-mode-only color palette (industrial dark theme) |
| `src/pages/home.tsx` | Homepage: banner carousel, featured products grid, popup dialog, hardcoded "Neden Skyrich?" marketing section |
| `src/pages/products.tsx` | Product listing; search + category filter; renders all batteries returned by API |
| `src/pages/product-detail.tsx` | Product detail; **hardcoded "Stokta Var" badge**; renders dynamic battery data |
| `src/pages/battery-finder.tsx` | Vehicle-based battery finder; queries `/api/finder/*` |
| `src/pages/about.tsx` | About page; fetches `hakkimizda` page content from API; has empty placeholder grid from removed stats |
| `src/pages/contact.tsx` | Contact page; **form submits to `console.log` only** (no backend integration); fetches contact info from site settings |
| `src/pages/admin/login.tsx` | Admin login; calls `/api/admin/login`, stores token in `localStorage` |
| `src/pages/admin/panel.tsx` | Admin dashboard; client-side localStorage token check; stats cards; tabbed CRUD panels |
| `src/pages/admin/components/admin-batteries.tsx` | Battery CRUD dialog; **defaults voltage to `12` and offers AGM/GEL/JEL as technology options** |
| `src/pages/admin/components/admin-banners.tsx` | Banner CRUD |
| `src/pages/admin/components/admin-popups.tsx` | Popup CRUD |
| `src/pages/admin/components/admin-site-settings.tsx` | Site settings editor (SEO title, description, contact info) |
| `src/pages/admin/components/admin-hero-settings.tsx` | Hero section editor |
| `src/pages/admin/components/admin-page-contents.tsx` | Page content editor for predefined keys |
| `src/components/layout/navbar.tsx` | Sticky header nav; mobile menu toggle |
| `src/components/layout/footer.tsx` | Footer; dynamic from site settings and page content |
| `src/components/ui/*.tsx` | shadcn/ui primitive components (~50 files) |

### API Server (`artifacts/api-server/`)
| File | Purpose |
|------|---------|
| `src/index.ts` | Entry point; requires `PORT` env var |
| `src/app.ts` | Express app setup; CORS enabled globally; JSON body parsing; mounts `/api` router |
| `src/routes/index.ts` | Aggregates all route modules (no auth middleware applied) |
| `src/routes/admin.ts` | `/admin/login` (hardcoded fallback password + static token); `/admin/stats` (unprotected) |
| `src/routes/batteries.ts` | Battery CRUD endpoints; no SKU whitelist enforcement |
| `src/routes/banners.ts` | Banner CRUD |
| `src/routes/popups.ts` | Popup CRUD |
| `src/routes/settings.ts` | Site settings, hero settings, page contents CRUD |
| `src/routes/finder.ts` | Vehicle compatibility and battery finder endpoints |
| `src/routes/health.ts` | Health check |
| `build.mjs` | esbuild bundler script for the API (Node ESM) |

### Database / Schema (`lib/db/`)
| File | Purpose |
|------|---------|
| `src/index.ts` | PostgreSQL Pool + Drizzle ORM init; requires `DATABASE_URL` |
| `src/schema/batteries.ts` | Battery table schema (`modelCode`, `name`, `voltage`, `capacity`, `cca`, `type`, `technology`, `dimensions`, `weight`, `imageUrl`, `applications`, `active`, `featured`, `sortOrder`) |
| `src/schema/banners.ts` | Banner table schema |
| `src/schema/popups.ts` | Popup table schema |
| `src/schema/vehicleCompatibility.ts` | Vehicle compatibility mapping schema |
| `src/schema/siteSettings.ts` | Site settings (contact info, social links, SEO fields) |
| `src/schema/heroSettings.ts` | Hero section content schema |
| `src/schema/pageContents.ts` | Page content key-value schema |

### API Spec / Client (`lib/api-spec/`, `lib/api-client-react/`, `lib/api-zod/`)
| File | Purpose |
|------|---------|
| `lib/api-spec/openapi.yaml` | OpenAPI contract (Orval source) |
| `lib/api-client-react/src/generated/api.ts` | Generated TanStack Query hooks (useListBatteries, useCreateBattery, etc.) |
| `lib/api-client-react/src/custom-fetch.ts` | Fetch wrapper with base URL and bearer token support |
| `lib/api-zod/src/generated/api.ts` | Generated Zod schemas for request/response validation |

### Public Assets (`artifacts/skyrich-tr/public/`)
| File | Purpose |
|------|---------|
| `favicon.svg` | Site favicon |
| `robots.txt` | `Allow: /` (allows everything, no admin disallow) |
| `opengraph.jpg` | Generic OG image |
| `images/battery-agm.png` | Static fallback image for AGM batteries |
| `images/battery-lithium.png` | Static fallback image for lithium batteries |
| `images/factory.png` | Factory image used in About page hero |
| `images/hero-1.png` | Default hero background |
| `images/hero-2.png` | Extra hero image |

---

## 3. Public Site Audit

### Homepage (`/`) — `src/pages/home.tsx`
- **Hero carousel**: Dynamic from API (`banners` table + `hero_settings` fallback). ✅ Good.
- **Featured products**: Dynamic from API (`batteries` with `featured=true`). ✅ Good.
- **Popup**: Dynamic from API (`popups` table with date/frequency logic). ✅ Good.
- **"Neden Skyrich?" section**: **HARDCODED marketing claims**:
  - Line 188: `"Kurşun asit akülere göre %65'e kadar daha hafif."`
  - Line 195: `"Geleneksel akülere göre 4 kata kadar daha uzun kullanım ömrü."`
  - Line 202: `"Yüksek CCA değerleri ile anında tepki."`
  - ⚠️ These are unverified performance claims and percentages.

### Product Listing (`/urunler`) — `src/pages/products.tsx`
- Renders all batteries returned by API. ✅ Dynamic.
- ⚠️ **No SKU whitelist enforcement**: the public API returns any active battery in the database, not restricted to the 12 approved SKUs.
- Category filter only shows "Lithium" category; database schema allows other types.

### Product Detail (`/urunler/:id`) — `src/pages/product-detail.tsx`
- Renders dynamic battery data. ✅ Good.
- **Line 85: Hardcoded "Stokta Var" badge** with green checkmark. This implies stock status that may not be real.
- Specs render `battery.voltage || '-'`, etc. If empty from admin, shows `-`. ✅ Acceptable fallback.
- "Bayi Bul" button is a placeholder (no dealer locator functionality).

### Battery Finder (`/aku-bulucu`) — `src/pages/battery-finder.tsx`
- Vehicle make/model/year search. ✅ Dynamic from API.
- Compatible batteries rendered dynamically. ✅ Good.
- "Aracınızı Seçin" empty state is acceptable.

### About (`/hakkimizda`) — `src/pages/about.tsx`
- Content is dynamic from `pageContents` API (`hakkimizda` key). ✅ Good.
- Empty fallback: `"İçerik yakında eklenecek."` ✅ Acceptable.
- Right column has empty invisible placeholder div (remnant of removed hardcoded stats).

### Contact (`/iletisim`) — `src/pages/contact.tsx`
- Contact info (phone/email/address/whatsapp) is dynamic from `siteSettings`. ✅ Good.
- Fallback message shown when no settings configured. ✅ Good.
- **Contact form submits only to `console.log`** — no actual backend endpoint, no email service, no database storage. The toast says "Mesajınız Gönderildi" but nothing is sent.

### Footer — `src/components/layout/footer.tsx`
- Footer description dynamic from `pageContents` (`footer-description`). ✅ Good.
- Social links dynamic from `siteSettings`. ✅ Good.
- Contact info dynamic from `siteSettings`. ✅ Good.
- Copyright auto-updates year. ✅ Good.

### Navbar — `src/components/layout/navbar.tsx`
- Static nav items. ✅ Acceptable for a small catalog.
- Mobile menu toggle implemented. ✅ Good.

### Popup — `src/pages/home.tsx`
- Dynamic from API. ✅ Good.
- Supports `https://wa.me/` external links. ✅ Good.

---

## 4. Admin Panel Audit

### Login / Auth Method
- Route: `/admin` → `AdminLogin` component.
- Calls `POST /api/admin/login` with password.
- On success, stores token in `localStorage` under key `admin_token`.
- **Hardcoded fallback password in backend**: `const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "skyrich2025";`
- **Hardcoded static token in backend**: `const ADMIN_TOKEN = "skyrich-admin-token-2025";`
- ⚠️ Password is documented in `replit.md` (line 40, 52, 62).

### Admin Route Protection
- `AdminPanel` component (`panel.tsx:17-22`) checks `localStorage.getItem("admin_token")` on mount and redirects to `/admin` if missing.
- **This is client-side only**. The underlying API endpoints have **no authentication middleware**.

### Public Access to Admin APIs
- **Critical**: Anyone can call `POST /api/banners`, `PATCH /api/batteries/:id`, `DELETE /api/popups/:id`, `PUT /api/site-settings`, etc. without any token.
- There is **no bearer token validation middleware** on any admin-mutation endpoints.
- The backend `custom-fetch.ts` supports `Authorization: Bearer` headers, but the Express app never checks them.

### Product Management (`admin-batteries.tsx`)
- Full CRUD dialog with fields: modelCode, name, description, voltage, capacity, CCA, type, technology, dimensions, weight, imageUrl, applications, active, featured, sortOrder.
- **Default form values**: `voltage: 12`, `technology: "Lithium"`.
- **Technology dropdown includes AGM and GEL/JEL options** (lines 219-222). This allows creating non-lithium products from the admin, which conflicts with the Skyrich lithium-only distributor positioning.
- **No SKU validation against the 12 approved import list** at creation or update time.
- Image URL is a free-text input with no validation/format check.

### Image Management
- Images are handled via text URL inputs (no file upload, no image hosting, no CDN integration).
- Placeholder static images exist in `public/images/`.

### Site Settings / Hero / Popup / Page Content Editors
- All dynamic from database. ✅ Good.
- All mutation endpoints are unprotected. ❌ Critical.

---

## 5. API / Security Audit

### Endpoint Matrix

| Endpoint | Auth Required | Actually Enforced | Risk |
|----------|--------------|-------------------|------|
| `GET /api/batteries` | Public | N/A | Low |
| `GET /api/batteries/:id` | Public | N/A | Low |
| `POST /api/batteries` | Admin | **NO** | **Critical** |
| `PATCH /api/batteries/:id` | Admin | **NO** | **Critical** |
| `DELETE /api/batteries/:id` | Admin | **NO** | **Critical** |
| `GET /api/banners` | Public | N/A | Low |
| `POST /api/banners` | Admin | **NO** | **Critical** |
| `PATCH /api/banners/:id` | Admin | **NO** | **Critical** |
| `DELETE /api/banners/:id` | Admin | **NO** | **Critical** |
| `GET /api/popups` | Public | N/A | Low |
| `POST /api/popups` | Admin | **NO** | **Critical** |
| `PATCH /api/popups/:id` | Admin | **NO** | **Critical** |
| `DELETE /api/popups/:id` | Admin | **NO** | **Critical** |
| `GET /api/site-settings` | Public | N/A | Low |
| `PUT /api/site-settings` | Admin | **NO** | **Critical** |
| `GET /api/hero-settings` | Public | N/A | Low |
| `PUT /api/hero-settings` | Admin | **NO** | **Critical** |
| `GET /api/page-contents` | Public | N/A | Low |
| `PUT /api/page-contents/:key` | Admin | **NO** | **Critical** |
| `POST /api/admin/login` | Public | N/A | Medium (weak password fallback) |
| `GET /api/admin/stats` | Admin | **NO** | **High** |
| `GET/POST/DELETE /api/vehicle-compatibility` | Admin | **NO** | **Critical** |

### Secrets in Code
- `artifacts/api-server/src/routes/admin.ts:9`: `const ADMIN_TOKEN = "skyrich-admin-token-2025";` — hardcoded static token.
- `artifacts/api-server/src/routes/admin.ts:8`: `const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "skyrich2025";` — hardcoded fallback password.
- `replit.md`: Documents the admin password in plaintext (`şifre: skyrich2025`).
- No `.env` files found in repo (good), but fallback values mean the app works insecurely out-of-the-box.

### Input Validation
- Zod schemas are used for request body parsing on most endpoints. ✅ Good for structure.
- No input sanitization (e.g., `imageUrl` accepts any string; could be used for XSS via `<img src>` if rendered unsafely).
- No rate limiting.
- No SQL injection risk (Drizzle ORM parameterized queries used throughout).

### CORS
- `app.use(cors())` in `app.ts` allows **all origins**. For a production API, this should be restricted to the frontend domain.

---

## 6. Content Correctness Audit

### Hardcoded Fake / Unverified Content Found

| File | Line | Content | Severity |
|------|------|---------|----------|
| `artifacts/skyrich-tr/src/pages/product-detail.tsx` | 85 | `<Check size={14} /> Stokta Var` — hardcoded stock claim | **High** |
| `artifacts/skyrich-tr/src/pages/home.tsx` | 188 | `"Kurşun asit akülere göre %65'e kadar daha hafif."` — unverified percentage claim | **High** |
| `artifacts/skyrich-tr/src/pages/home.tsx` | 195 | `"Geleneksel akülere göre 4 kata kadar daha uzun kullanım ömrü."` — unverified multiplier claim | **High** |
| `artifacts/skyrich-tr/src/pages/home.tsx` | 202 | `"Yüksek CCA değerleri ile anında tepki."` — subjective performance claim | Medium |
| `artifacts/skyrich-tr/index.html` | 7 | `meta name="description" content="Skyrich Battery TR — built on Replit..."` | Medium |
| `artifacts/skyrich-tr/index.html` | 10 | `og:description` same Replit branding | Medium |
| `artifacts/skyrich-tr/src/pages/contact.tsx` | 36-42 | Form `onSubmit` only `console.log`s; toast falsely claims message was sent | **High** |
| `artifacts/api-server/src/routes/admin.ts` | 8 | Hardcoded fallback password `skyrich2025` | **Critical** |
| `artifacts/api-server/src/routes/admin.ts` | 9 | Hardcoded static admin token `skyrich-admin-token-2025` | **Critical** |
| `replit.md` | 40, 52, 62 | Admin password documented in plaintext | **High** |
| `artifacts/skyrich-tr/src/pages/admin/components/admin-batteries.tsx` | 26, 74 | Default `voltage: 12` in create form (invented default) | Medium |
| `artifacts/skyrich-tr/src/pages/admin/components/admin-batteries.tsx` | 219-222 | Technology options include `AGM` and `GEL`/`JEL` | Medium |

### Missing SKU Enforcement
- The database and API allow any `modelCode` to be created.
- The public listing page renders any active battery regardless of whether it is in the approved 12-SKU list.
- **Approved SKUs that must be the only public products:**
  `HJTX9-FP`, `HJTX14H-FP`, `HJTZ10S-FP`, `HJTZ14S-FPZ`, `HJTZ14S-FP`, `HJ51913-FP`, `HJTX20HQ-FP`, `HJTZ7S-FPZ`, `HJTX20CH-FP`, `HJ13L-FPZ`, `HJT9B-FP`, `HJT7B-FPZ`

---

## 7. SEO Audit

| Item | Status | Notes |
|------|--------|-------|
| `<title>` | ❌ Static only | `index.html` has hardcoded `<title>Skyrich Battery TR</title>`; no per-page dynamic titles |
| Meta description | ❌ Generic / Replit-branded | `index.html` says "built on Replit" |
| Canonical URL | ❌ Missing | No `<link rel="canonical">` |
| Open Graph | ❌ Generic | `og:title`, `og:description` are static and reference Replit |
| Twitter Cards | ❌ Generic | Same static content |
| Product detail metadata | ❌ Missing | No dynamic `<title>` or `<meta>` for individual product pages |
| `sitemap.xml` | ❌ Missing | Not generated or served |
| `robots.txt` | ⚠️ Too permissive | `Allow: /` allows everything; no `Disallow: /admin` |
| Structured data (JSON-LD) | ❌ Missing | No Schema.org `Product`, `Organization`, etc. |
| `noindex` for admin | ❌ Missing | Admin routes (`/admin`, `/admin/panel`) not blocked from indexing |
| Vercel deployment | ⚠️ Unclear | Frontend is SPA; no SSR mechanism for meta injection |

**Canonical domain requirement**: `https://www.skyrichbattery.com.tr` should be canonical. `https://www.skyrichpower.com.tr` should be documented as 301 redirect alias. Neither is referenced in code.

---

## 8. Vercel Readiness Audit

| Requirement | Status | Notes |
|-------------|--------|-------|
| Frontend build command | ⚠️ Conditional | `vite build --config vite.config.ts` requires `PORT` and `BASE_PATH` env vars to even load the config file |
| Frontend start command | ⚠️ Conditional | `vite preview` also requires `PORT` and `BASE_PATH` |
| API build command | ✅ Works | `node ./build.mjs` produces `dist/index.mjs` |
| API start command | ✅ Works | `node --enable-source-maps ./dist/index.mjs` requires `PORT` and `DATABASE_URL` |
| Environment variables | ❌ Missing | No `.env` files; Vite and API both throw if `PORT`/`BASE_PATH` are unset |
| Database | ⚠️ External dependency | Requires hosted PostgreSQL (e.g., Vercel Postgres, Supabase, Neon) |
| Replit-specific code | ❌ Present | `.replit` file; `replit.md`; Vite plugins `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner`, `@replit/vite-plugin-runtime-error-modal` |
| SPA routing on Vercel | ❌ Needs config | `wouter` uses hashless routing; Vercel needs `rewrites` in `vercel.json` to serve `index.html` for all routes |
| API on Vercel | ❌ Needs architecture decision | Express API is a separate Node server. For Vercel, either: (a) deploy API as separate service, (b) convert to Vercel Serverless Functions, or (c) run as monorepo with two projects |
| Frontend-API communication | ❌ No base URL set | `custom-fetch.ts` supports `setBaseUrl()`, but `main.tsx` never calls it. In dev this relies on same-origin or Replit proxy magic. For production, the frontend needs to know the API origin. |
| Storage for images | ❌ No strategy | Image URLs are external strings; no upload mechanism; static assets in `public/` only |

---

## 9. Critical Blockers

| Blocker | Severity | Affected Files | Why It Matters | Recommended Fix |
|---------|----------|---------------|----------------|-------------------|
| **All admin mutation APIs are publicly accessible** | **Critical** | `api-server/src/routes/*.ts` (all POST/PATCH/DELETE/PUT endpoints) | Anyone can create, edit, delete products, banners, popups, and site settings without authentication. Complete data integrity compromise. | Add Express middleware that validates `Authorization: Bearer <token>` header against a secure server-side secret on all mutation endpoints. |
| **Hardcoded static admin token** | **Critical** | `api-server/src/routes/admin.ts:9` | Token is guessable and identical for all sessions. Revocation impossible. | Replace with cryptographically random token stored in env var; or implement JWT/session-based auth. |
| **Hardcoded fallback admin password** | **Critical** | `api-server/src/routes/admin.ts:8` | Default password `skyrich2025` is in source code and `replit.md`. If `ADMIN_PASSWORD` env var is not set, the app is trivially hackable. | Remove fallback; throw if `ADMIN_PASSWORD` is not set. Force strong password via env var. |
| **Hardcoded "Stokta Var" on product detail** | **High** | `skyrich-tr/src/pages/product-detail.tsx:85` | Displays false stock availability. Violates "no fake stock" rule. | Remove badge or replace with dynamic field from database (default empty). |
| **Contact form is fake (console.log only)** | **High** | `skyrich-tr/src/pages/contact.tsx:35-42` | User sees "Mesajınız Gönderildi" but nothing is sent. Deceptive UX. | Implement a real `POST /api/contact` endpoint or remove the form until a backend/email service is ready. |
| **No approved SKU enforcement** | **High** | `api-server/src/routes/batteries.ts`, `skyrich-tr/src/pages/products.tsx` | Database can contain products outside the 12 approved SKUs, and they will appear publicly if `active=true`. | Add a database-level whitelist or API filter so public endpoints only return batteries with `modelCode` in the approved 12-SKU list. |
| **Unverified marketing claims on homepage** | **High** | `skyrich-tr/src/pages/home.tsx:186-204` | Claims like "%65 lighter", "4x longer life" are hardcoded without official source verification. Legal/compliance risk. | Replace with generic, verified official copy or make the section fully editable from admin panel. |
| **Generic/Replit-branded meta tags** | **High** | `skyrich-tr/index.html:7-14` | SEO description says "built on Replit". Unprofessional and bad for indexing. | Replace with proper Turkish description for Skyrich distributor. |
| **CORS wide open** | **High** | `api-server/src/app.ts:28` | `app.use(cors())` allows any origin to call the API. CSRF/data-leak risk. | Restrict CORS to the production frontend domain(s). |
| **Admin password in plaintext documentation** | **High** | `replit.md:40,52,62` | Password exposed in repo. | Remove password from docs; document env var requirement only. |
| **No auth middleware on `/admin/stats`** | **High** | `api-server/src/routes/admin.ts:29-46` | Stats endpoint leaks business data. | Add bearer token validation middleware. |
| **No `robots.txt` protection for admin** | **Medium** | `skyrich-tr/public/robots.txt` | Search engines can index `/admin` and `/admin/panel`. | Add `Disallow: /admin` to `robots.txt`; add `<meta name="robots" content="noindex">` to admin pages. |
| **Missing sitemap, canonical, OG** | **Medium** | SEO-related | Poor discoverability and social sharing. | Generate `sitemap.xml`, add canonical link, update OG meta per page. |
| **Vite config requires `PORT`/`BASE_PATH`** | **Medium** | `skyrich-tr/vite.config.ts` | Build fails on Vercel if these are missing. | Make env vars optional with sensible defaults for static builds, or document them. |
| **Technology dropdown allows AGM/GEL** | **Medium** | `admin-batteries.tsx:219-222` | Admin can accidentally create non-lithium products. | Remove AGM/GEL options; keep only Lithium (or add a warning). |
| **Default voltage = 12 in admin form** | **Medium** | `admin-batteries.tsx:26,74` | Pre-fills a spec that may not be verified. | Leave defaults blank/null. |
| **No `.env` / no deployment docs** | **Medium** | Root | Missing setup instructions for Vercel. | Add `.env.example` and deployment README. |

---

## 10. Implementation Plan

### Phase 1: Security / Auth Hardening (Do First — Blockers)
1. Remove hardcoded `ADMIN_PASSWORD` fallback and `ADMIN_TOKEN` from `admin.ts`.
2. Move admin password and a cryptographically random token secret to **environment variables only**.
3. Create Express middleware (`requireAdminAuth`) that reads `Authorization: Bearer <token>` and validates it against the server-side secret.
4. Apply `requireAdminAuth` to **all** mutation endpoints: `POST/PATCH/DELETE` for batteries, banners, popups, vehicle-compatibility, and all `PUT` endpoints for settings/hero/page-contents.
5. Restrict CORS to the production domain(s).
6. Remove admin password from `replit.md`.
7. Implement a real contact form backend endpoint or disable the form until ready.

### Phase 2: Content Cleanup
1. Remove hardcoded `"Stokta Var"` badge from `product-detail.tsx`.
2. Replace or remove the hardcoded "Neden Skyrich?" marketing claims (`%65`, `4x`, etc.) on homepage. Either make them editable from admin or replace with safe, verified generic copy.
3. Update `index.html` meta description and OG tags to proper Turkish content for Skyrich distributor.
4. Fix `robots.txt` to `Disallow: /admin`.
5. Add `<meta name="robots" content="noindex, nofollow">` to admin pages.

### Phase 3: Admin Dynamic Content Completion
1. Enforce the **12 approved SKU whitelist** on public `GET /api/batteries` and `GET /api/batteries/:id` endpoints (or filter at DB query level).
2. Remove `AGM` and `GEL`/`JEL` options from the admin battery technology dropdown.
3. Clear default values in admin battery form (set `voltage`, `capacity`, `cca`, `weight` defaults to `undefined` instead of `12`, `0`, `0`, `0`).
4. Add basic image URL validation (optional: allow only `https?://` or local `/images/` paths).

### Phase 4: SEO / Sitemap / Robots
1. Add `sitemap.xml` generation (static file or API endpoint) with the 12 product detail URLs + static pages.
2. Add `<link rel="canonical" href="https://www.skyrichbattery.com.tr{path}">` per page (or use a React Helmet-like solution; for SPA, a post-build injection or server-side solution may be needed).
3. Update Open Graph and Twitter meta tags to proper brand copy.
4. Add structured data (JSON-LD) for `Organization` and `Product` on appropriate pages.

### Phase 5: Mobile Visual Polish
1. Review product card text sizes on small screens (some `text-[10px]` labels may be too small).
2. Ensure admin table columns do not overflow on mobile (already has some `overflow-x-auto` on tabs).
3. Test battery finder form layout on mobile (already uses responsive grid).

### Phase 6: Vercel Deployment Readiness
1. Create `.env.example` documenting required variables (`DATABASE_URL`, `ADMIN_PASSWORD`, `ADMIN_TOKEN_SECRET`, `BASE_PATH`, `API_BASE_URL`).
2. Adjust `vite.config.ts` to make `PORT` and `BASE_PATH` optional (provide defaults for static build).
3. Remove or conditionally disable Replit-specific Vite plugins when `REPL_ID` is absent.
4. Configure frontend `setBaseUrl()` to point to the deployed API origin.
5. Create `vercel.json` for the frontend with SPA rewrites (`{"source": "/(.*)", "destination": "/index.html"}`).
6. Decide API hosting strategy: (a) separate Node server (Railway, Render, etc.), (b) Vercel Serverless Functions, or (c) Edge Functions. Update build/deployment docs accordingly.
7. Set up a hosted PostgreSQL instance and run Drizzle migrations/push.

---

## 11. Overall Safety Assessment

| Scenario | Verdict | Reasoning |
|----------|---------|-----------|
| **Safe to show as internal preview?** | ⚠️ **Caution** | The site renders correctly, but the contact form is deceptive, fake stock claims exist, and admin APIs are wide open. Only show on a trusted local network. |
| **Safe to show to business owner?** | ❌ **Not yet** | Hardcoded "Stokta Var", unverified marketing percentages, Replit-branded meta tags, and lack of SKU enforcement will erode trust. Fix Phase 1–3 first. |
| **Safe to connect to skyrichbattery.com.tr?** | ❌ **Absolutely not yet** | Publicly writable APIs, hardcoded secrets, missing SEO basics, and no canonical domain setup make this unsafe for a real domain. Complete Phase 1–4 and security hardening before DNS connection. |

---

## Appendix: Approved SKU Reference (Authority List)

Only these 12 SKUs may be active/public on the website:

1. `HJTX9-FP`
2. `HJTX14H-FP`
3. `HJTZ10S-FP`
4. `HJTZ14S-FPZ`
5. `HJTZ14S-FP`
6. `HJ51913-FP`
7. `HJTX20HQ-FP`
8. `HJTZ7S-FPZ`
9. `HJTX20CH-FP`
10. `HJ13L-FPZ`
11. `HJT9B-FP`
12. `HJT7B-FPZ`

Any other product in the database must be filtered out of public responses unless explicitly added to this list by the business owner.
