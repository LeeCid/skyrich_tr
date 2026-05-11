# Deployment Checklist

## Step A — Create PostgreSQL Database
- [ ] Create a PostgreSQL database (Railway, Supabase, AWS RDS, or VPS)
- [ ] Note the connection string: `postgresql://user:password@host:port/database`
- [ ] Ensure the database is accessible from your API host

## Step B — Deploy API to Railway / Render / VPS
- [ ] Push code to GitHub
- [ ] Create a new Railway/Render project from the GitHub repo
- [ ] Set root directory to `artifacts/api-server`
- [ ] Set build command: `pnpm install && pnpm run build`
- [ ] Set start command: `node dist/index.mjs`

## Step C — Set API Environment Variables
```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
ADMIN_PASSWORD=<generate-strong-password>
ADMIN_API_TOKEN=<generate-64-char-random-token>
FRONTEND_ORIGIN=https://www.skyrichbattery.com.tr
```

## Step D — Run DB Migration / Seed
- [ ] Apply database schema (if migrations exist)
- [ ] Seed initial data if needed
- [ ] Verify connection: API logs should show "Server listening"

## Step E — Test API Health
```bash
curl https://api.skyrichbattery.com.tr/api/healthz
```
Expected: `200 OK`

## Step F — Deploy Frontend to Vercel
- [ ] Connect GitHub repo to Vercel
- [ ] Framework preset: **Vite**
- [ ] Root directory: `artifacts/skyrich-tr`
- [ ] Build command: `pnpm run build`
- [ ] Output directory: `dist/public`

## Step G — Set Frontend Environment Variable
```bash
VITE_API_BASE_URL=https://api.skyrichbattery.com.tr
```

## Step H — Connect www.skyrichbattery.com.tr to Vercel
- [ ] Add `www.skyrichbattery.com.tr` as a production domain in Vercel
- [ ] Update DNS to point to Vercel (CNAME or A record as instructed)
- [ ] Wait for SSL certificate to provision automatically

## Step I — Connect api.skyrichbattery.com.tr to API Host
- [ ] Add `api.skyrichbattery.com.tr` as a custom domain in Railway/Render
- [ ] Update DNS CNAME record to point to the API host
- [ ] Verify SSL is active

## Step J — Configure Cloudflare 301 Redirects
| From | To |
|------|-----|
| `skyrichbattery.com.tr` | `www.skyrichbattery.com.tr` |
| `www.skyrichpower.com.tr` | `www.skyrichbattery.com.tr` |
| `skyrichpower.com.tr` | `www.skyrichbattery.com.tr` |

## Step K — Run Production Smoke Tests
```bash
API_BASE_URL=https://api.skyrichbattery.com.tr \
FRONTEND_URL=https://www.skyrichbattery.com.tr \
bash scripts/smoke-production.sh
```

Expected: all tests pass.

## Step L — Admin Setup After Deploy

Log in to `https://www.skyrichbattery.com.tr/admin` and update:

### Site Settings tab
- [ ] WhatsApp number
- [ ] Phone number
- [ ] Email address
- [ ] Physical address
- [ ] Instagram URL
- [ ] Facebook URL
- [ ] SEO title and description

### Hero Settings tab
- [ ] Hero title and subtitle
- [ ] CTA button texts and links
- [ ] Background image URL

### Popup tab
- [ ] Active popup title, content, CTA
- [ ] WhatsApp button link

### Batteries tab
- [ ] Upload product images for each SKU
- [ ] Fill verified technical specs from official sources only
- [ ] Mark products as active when ready

### Banners tab
- [ ] Add homepage carousel banners with images and links

### Page Contents tab
- [ ] Hakkımızda page text
- [ ] Footer description
- [ ] Contact page intro text

## Rollback Plan
- Revert to previous git commit
- Re-deploy frontend and backend
