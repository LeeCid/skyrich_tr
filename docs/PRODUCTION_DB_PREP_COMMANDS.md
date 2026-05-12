# Production Database Preparation Commands

**Date:** May 12, 2026
**Branch:** premium-polish

---

## PowerShell Production DB Migration and Seed

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
- Replace `<PRODUCTION_POSTGRES_URL>` with actual production PostgreSQL connection string
- `SEED_FORCE=1`: Force seed even if data exists
- `SEED_FIX_TEXT=1`: Fix text encoding for Turkish characters

---

## API Data Verification (PowerShell)

```powershell
# Verify API returns data after seed
Invoke-RestMethod https://api.skyrichbattery.com.tr/api/batteries | ConvertTo-Json -Depth 10
```

**Expected Result:** JSON array of battery products with all fields populated.

---

## Troubleshooting

### Database Migration Fails
- Check DATABASE_URL is correct and accessible
- Check PostgreSQL server is running
- Check user has CREATE TABLE permissions

### Seed Fails
- Check DATABASE_URL is set
- Check schema was pushed successfully
- Check SEED_FORCE and SEED_FIX_TEXT are set

### API Verification Fails
- Check API server is deployed and running
- Check API domain is accessible
- Check database is seeded correctly
