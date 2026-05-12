# Production Deployment Runbook

**Date:** May 12, 2026
**Branch:** premium-polish
**Latest Commit:** c105686 — fix: unblock production validation after catalog polish

---

## Architecture

### Frontend
- **Platform:** Vercel
- **Framework:** React + Vite + Tailwind CSS
- **Domain:** www.skyrichbattery.com.tr

### API
- **Platform:** Railway/Render/VPS
- **Framework:** Express 5 + Drizzle ORM
- **Domain:** api.skyrichbattery.com.tr

### Database
- **Platform:** PostgreSQL (managed)
- **Provider:** Railway/Render/Supabase

### Domains
- www.skyrichbattery.com.tr → Frontend (Vercel)
- api.skyrichbattery.com.tr → API (Railway/Render/VPS)

---

## Required API Environment Variables

```bash
NODE_ENV=production
DATABASE_URL=<production postgres url>
PORT=8080
ADMIN_PASSWORD=<strong password>
ADMIN_API_TOKEN=<strong random token (64+ characters)>
FRONTEND_ORIGIN=https://www.skyrichbattery.com.tr
```

**Notes:**
- `ADMIN_PASSWORD`: Strong password for admin panel login
- `ADMIN_API_TOKEN`: Long random secret string (64+ characters) returned by `/api/admin/login`
- `DATABASE_URL`: PostgreSQL connection string
- `FRONTEND_ORIGIN`: Frontend URL for CORS

---

## Required Frontend Environment Variables

```bash
VITE_API_BASE_URL=https://api.skyrichbattery.com.tr
BASE_PATH=/
```

**Notes:**
- `VITE_API_BASE_URL`: API base URL for frontend to call
- `BASE_PATH`: Base path for routing (typically `/` for root domain)

---

## Frontend Deployment

### Project/Root Directory
`artifacts/skyrich-tr`

### Build Command
```bash
cd artifacts/skyrich-tr
pnpm run build
```

### Output Directory
`dist/public`

### Vercel Deployment
1. Create Vercel project (if not exists)
2. Connect to GitHub repository
3. Import project from `artifacts/skyrich-tr`
4. Set environment variables:
   - `VITE_API_BASE_URL=https://api.skyrichbattery.com.tr`
   - `BASE_PATH=/`
5. Build settings:
   - Framework: Vite
   - Build command: `pnpm run build`
   - Output directory: `dist/public`
6. Deploy
7. Configure domain: www.skyrichbattery.com.tr

---

## API Deployment

### Build Command (from repo root)
```bash
pnpm --filter @workspace/api-server run build
```

### Start Command (from repo root)
```bash
pnpm --filter @workspace/api-server run start
```

### Alternative Direct Command
```bash
node --enable-source-maps ./artifacts/api-server/dist/index.mjs
```

### Railway/Render Deployment
1. Create Railway/Render project (if not exists)
2. Connect to GitHub repository
3. Import project from repo root
4. Set environment variables:
   - `NODE_ENV=production`
   - `DATABASE_URL=<production postgres url>`
   - `PORT=8080`
   - `ADMIN_PASSWORD=<strong password>`
   - `ADMIN_API_TOKEN=<strong random token>`
   - `FRONTEND_ORIGIN=https://www.skyrichbattery.com.tr`
5. Build settings:
   - Build command: `pnpm --filter @workspace/api-server run build`
   - Start command: `pnpm --filter @workspace/api-server run start`
6. Deploy
7. Configure domain: api.skyrichbattery.com.tr

---

## Database Migration and Seed

### PowerShell Commands
```powershell
cd C:\Users\Irmak\Desktop\Skyrich_TR

# Set production DATABASE_URL
$env:DATABASE_URL="<PRODUCTION_POSTGRES_URL>"

# Push schema to database
pnpm.cmd --filter @workspace/db run push

# Seed product data
$env:SEED_FORCE="1"
$env:SEED_FIX_TEXT="1"
pnpm.cmd --filter @workspace/scripts run seed:products

# Clean up environment variables
Remove-Item Env:\SEED_FORCE
Remove-Item Env:\SEED_FIX_TEXT
Remove-Item Env:\DATABASE_URL
```

**Notes:**
- `SEED_FORCE=1`: Force seed even if data exists
- `SEED_FIX_TEXT=1`: Fix text encoding for Turkish characters
- Run seed after schema push

---

## Post-Deployment Smoke Test

### Frontend URLs
- Homepage: https://www.skyrichbattery.com.tr
- Products: https://www.skyrichbattery.com.tr/urunler
- Product Detail: https://www.skyrichbattery.com.tr/urunler/HJTX9-FP
- Battery Finder: https://www.skyrichbattery.com.tr/aku-bulucu
- Contact: https://www.skyrichbattery.com.tr/iletisim
- Admin: https://www.skyrichbattery.com.tr/admin

### API Endpoints
- Batteries API: https://api.skyrichbattery.com.tr/api/batteries
- Finder API: Test YTX9-BS → HJTX9-FP mapping

### Smoke Test Checklist
- [ ] Homepage loads
- [ ] Product listing loads
- [ ] Product detail loads
- [ ] Battery finder works
- [ ] Contact page loads
- [ ] Admin panel accessible (login with ADMIN_PASSWORD)
- [ ] API /api/batteries returns data
- [ ] Finder API maps YTX9-BS to HJTX9-FP
- [ ] WhatsApp CTAs work
- [ ] Phone CTAs work
- [ ] Email CTAs work

---

## DNS Configuration

### Frontend (www)
- **Type:** CNAME or A record
- **Target:** Vercel target (e.g., cname.vercel-dns.com)
- **Name:** www
- **Value:** your-vercel-domain.vercel.app

### API (api)
- **Type:** CNAME or A record
- **Target:** API host target (Railway/Render/VPS)
- **Name:** api
- **Value:** your-api-host

### Bare Domain (Optional)
If using Cloudflare:
- **Type:** 301 redirect
- **Source:** skyrichbattery.com.tr (bare domain)
- **Target:** www.skyrichbattery.com.tr

**Note:** Configure DNS after frontend and API are deployed and domains are assigned.

---

## Troubleshooting

### Frontend Build Fails
- Check Node.js version (requires 20.19+ or 22.12+)
- Check environment variables are set
- Check build output directory is `dist/public`

### API Build Fails
- Check dependencies are installed
- Check DATABASE_URL is valid
- Check port 8080 is available

### Database Migration Fails
- Check DATABASE_URL is correct and accessible
- Check PostgreSQL server is running
- Check user has CREATE TABLE permissions

### Seed Fails
- Check DATABASE_URL is set
- Check schema was pushed successfully
- Check SEED_FORCE and SEED_FIX_TEXT are set

### Admin Panel Not Accessible
- Check ADMIN_PASSWORD is set
- Check API server is running
- Check API token is valid

---

## Rollback Procedure

### Frontend Rollback
- Go to Vercel dashboard
- Select deployment
- Click "Redeploy" to previous commit
- Or use Vercel CLI: `vercel rollback`

### API Rollback
- Go to Railway/Render dashboard
- Select deployment
- Click "Redeploy" to previous commit
- Or use CLI to re-deploy previous commit

### Database Rollback
- Backup database before migration
- Use `pnpm --filter @workspace/db run push` to re-apply schema
- Re-run seed if needed

---

## Security Notes

### Never Commit Secrets
- Do not commit `DATABASE_URL`, `ADMIN_PASSWORD`, `ADMIN_API_TOKEN`
- Use environment variables only
- Use `.env` file (already in `.gitignore`)

### Admin Panel
- Protect with strong `ADMIN_PASSWORD`
- Use HTTPS only in production
- Rotate `ADMIN_API_TOKEN` regularly

### Database
- Use managed PostgreSQL with automatic backups
- Use connection string with SSL
- Restrict database access to API server only

---

## Monitoring

### Frontend
- Vercel Analytics
- Vercel Logs
- Error tracking (optional: Sentry)

### API
- Railway/Render Logs
- Error tracking (optional: Sentry)
- Performance monitoring (optional: New Relic)

### Database
- PostgreSQL logs
- Query performance monitoring
- Backup verification

---

## Support

For deployment issues:
- Check Vercel/Railway/Render documentation
- Check this runbook
- Check `docs/PRODUCTION_NOTES.md`
- Check `DEPLOYMENT_CHECKLIST.md`
