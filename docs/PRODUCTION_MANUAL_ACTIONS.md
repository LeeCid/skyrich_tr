# Production Manual Actions

**Date:** May 12, 2026
**Branch:** premium-polish

---

## Manual Actions Required

These are the actions that must be performed manually by you (the user). Everything else has been automated or prepared.

---

### 1. Create Production PostgreSQL Database

**Action:** Create or provide production PostgreSQL DATABASE_URL.

**Options:**
- Railway PostgreSQL
- Render PostgreSQL
- Supabase PostgreSQL
- Managed VPS with PostgreSQL

**Steps:**
1. Create PostgreSQL instance
2. Get connection string (DATABASE_URL)
3. Save DATABASE_URL for API deployment

---

### 2. Create API Hosting Service

**Action:** Create API hosting service and set environment variables.

**Options:**
- Railway
- Render
- VPS (DigitalOcean, Linode, AWS, etc.)

**Steps:**
1. Create hosting service account
2. Create new project
3. Connect to GitHub repository
4. Set environment variables:
   - `NODE_ENV=production`
   - `DATABASE_URL=<your production postgres url>`
   - `PORT=8080`
   - `ADMIN_PASSWORD=<strong password>`
   - `ADMIN_API_TOKEN=<strong random 64+ char token>`
   - `FRONTEND_ORIGIN=https://www.skyrichbattery.com.tr`
5. Build and deploy

**Note:** See `docs/PRODUCTION_DEPLOYMENT_RUNBOOK.md` for detailed deployment instructions.

---

### 3. Create/Connect Vercel Project

**Action:** Create or connect Vercel project and set environment variables.

**Steps:**
1. Create Vercel account (if not exists)
2. Create new project
3. Connect to GitHub repository
4. Import project from `artifacts/skyrich-tr` directory
5. Set environment variables:
   - `VITE_API_BASE_URL=https://api.skyrichbattery.com.tr`
   - `BASE_PATH=/`
6. Build and deploy

**Note:** See `docs/PRODUCTION_DEPLOYMENT_RUNBOOK.md` for detailed deployment instructions.

---

### 4. Configure DNS

**Action:** Configure DNS for www and api subdomains.

**Steps:**
1. Go to DNS provider (Cloudflare, GoDaddy, Namecheap, etc.)
2. Add CNAME/A record for `www` pointing to Vercel target
3. Add CNAME/A record for `api` pointing to API host target
4. (Optional) Configure bare domain 301 redirect to www if using Cloudflare

**Note:** Configure DNS after frontend and API are deployed and domains are assigned.

---

### 5. Provide Strong Credentials

**Action:** Provide strong ADMIN_PASSWORD and ADMIN_API_TOKEN.

**Steps:**
1. Generate strong ADMIN_PASSWORD (at least 16 characters, mixed case, numbers, symbols)
2. Generate strong ADMIN_API_TOKEN (at least 64 random characters)
3. Set these in API hosting service environment variables
4. Save ADMIN_PASSWORD for admin panel login

**Security Note:** Never commit these credentials to the repository.

---

### 6. Admin Panel Configuration

**Action:** Log in to admin panel and fill in contact and SEO fields.

**Steps:**
1. Go to https://www.skyrichbattery.com.tr/admin
2. Log in with ADMIN_PASSWORD
3. Fill in contact information:
   - WhatsApp number
   - Phone number
   - Email address
   - Physical address
4. Fill in SEO fields:
   - Meta title
   - Meta description
   - OG image
5. Fill in hero/footer fields if applicable
6. Save changes

---

### 7. Final Browser Checks

**Action:** Run final browser checks on deployed site.

**Checklist:**
- [ ] Homepage loads correctly
- [ ] Product listing loads correctly
- [ ] Product detail pages load correctly
- [ ] Battery finder works
- [ ] Contact page loads correctly
- [ ] WhatsApp CTAs work
- [ ] Phone CTAs work
- [ ] Email CTAs work
- [ ] Admin panel accessible
- [ ] API endpoints return data
- [ ] No console errors
- [ ] No broken images
- [ ] No English text leakage
- [ ] No mojibake

---

## Summary

**Total Manual Actions:** 7

1. Create production PostgreSQL database
2. Create API hosting service
3. Create/connect Vercel project
4. Configure DNS
5. Provide strong credentials
6. Admin panel configuration
7. Final browser checks

**Estimated Time:** 1-2 hours (depending on account setup and DNS propagation)

**Documentation Reference:**
- `docs/PRODUCTION_DEPLOYMENT_RUNBOOK.md` - Detailed deployment instructions
- `docs/PRODUCTION_NOTES.md` - Production reference
- `DEPLOYMENT_CHECKLIST.md` - Deployment checklist
