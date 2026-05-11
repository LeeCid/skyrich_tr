# Deployment Checklist

## Prerequisites
- [ ] PostgreSQL database provisioned and accessible
- [ ] All environment variables configured (see `.env.example`)
- [ ] Domain registered and DNS configured
- [ ] SSL certificate available (Vercel handles this automatically)

## Environment Variables

### Backend (API Server)
```
DATABASE_URL=postgresql://...
ADMIN_PASSWORD=your-strong-password
ADMIN_API_TOKEN=your-secure-random-token
FRONTEND_ORIGIN=https://www.skyrichbattery.com.tr
PORT=3000
```

### Frontend (Vite SPA)
```
VITE_API_BASE_URL=https://api.skyrichbattery.com.tr
BASE_PATH=/
```

## Build Steps

### 1. Frontend Build
```bash
cd artifacts/skyrich-tr
npm install
npm run build
```
- Output: `artifacts/skyrich-tr/dist/public/`
- This is a static SPA with all routes falling back to `index.html`

### 2. Backend Build
```bash
cd artifacts/api-server
npm install
npm run build
```

## Vercel Deployment (Frontend)
1. Connect GitHub repo to Vercel
2. Set framework preset to "Vite"
3. Set root directory to `artifacts/skyrich-tr`
4. Add environment variable: `VITE_API_BASE_URL`
5. Deploy

## API Server Deployment
- Deploy `artifacts/api-server` to a Node.js host (Railway, Render, VPS)
- Ensure `FRONTEND_ORIGIN` matches the deployed frontend URL
- Database must be accessible from the API server

## Post-Deployment Verification
- [ ] Homepage loads without console errors
- [ ] Admin login works with correct credentials
- [ ] Admin mutations (create/update/delete) require Bearer token
- [ ] Public API returns only active + approved SKU products
- [ ] robots.txt is accessible and correct
- [ ] sitemap.xml returns valid XML with approved products
- [ ] Contact page shows WhatsApp CTA with correct phone number
- [ ] No fake stock/price/warranty claims visible
- [ ] 404 page works for unknown routes
- [ ] Mobile navigation closes after selecting a link
- [ ] All admin forms show validation errors for invalid input
- [ ] Image URLs are validated (javascript: blocked)

## Security Checklist
- [ ] `ADMIN_PASSWORD` and `ADMIN_API_TOKEN` are strong and unique
- [ ] No hardcoded secrets in source code
- [ ] CORS restricted to production domain
- [ ] Admin API endpoints require Bearer token
- [ ] No admin link in public navbar/footer

## Rollback Plan
- Revert to previous git commit
- Re-deploy frontend and backend
