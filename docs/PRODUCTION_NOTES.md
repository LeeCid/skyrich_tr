# Production Notes

**Skyrich Battery Türkiye** — Production deployment and maintenance reference.

---

## Architecture

- **Frontend:** `artifacts/skyrich-tr` — React + Vite + Tailwind CSS
- **API:** `artifacts/api-server` — Express + PostgreSQL
- **Database:** PostgreSQL (managed)
- **Admin Panel:** Built into frontend at `/admin`

---

## Required Environment Variables

### Database
- `DATABASE_URL` — PostgreSQL connection string

### Admin
- `ADMIN_PASSWORD` — Admin panel password
- `ADMIN_API_TOKEN` — API authentication token

### Frontend
- `FRONTEND_ORIGIN` — Frontend URL for CORS
- `VITE_API_BASE_URL` — API base URL

---

## Local Development Commands

### Database
```bash
cd lib/db
pnpm push # Push schema to database
```

### Seed Products
```bash
cd scripts
pnpm seed:products # Seed product data
```

### API Server
```bash
cd artifacts/api-server
pnpm dev # Development server
pnpm build # Production build
pnpm start # Production server
```

### Frontend
```bash
cd artifacts/skyrich-tr
pnpm dev # Development server
pnpm build # Production build
```

---

## Product Images

### Naming Convention
Canonical product images follow SKU naming:
```
/images/products/{modelCode}.png|webp|jpg
```

Examples:
- `/images/products/HJTX9-FP.png`
- `/images/products/HJTX14H-FP.png`
- `/images/products/HJ51913-FP.png`

### Image Mapping Script
```bash
cd scripts
pnpm map:product-images # Map numbered images to canonical SKUs
```

### Asset Verification
```bash
cd scripts
pnpm verify:assets # Verify all product images exist
```

### Numbered Aliases
Numbered images (01.png, 02.png, etc.) are kept as fallbacks for the image resolver. Do not delete unless all canonical SKU images exist and resolver no longer needs them.

---

## Deployment

### Frontend (Vercel)
```bash
cd artifacts/skyrich-tr
pnpm build
# Deploy to Vercel
```

### API (Railway/Render/VPS)
```bash
cd artifacts/api-server
pnpm build
# Deploy to Railway/Render/VPS
```

### Database
- Managed PostgreSQL (Railway/Render/Supabase)
- Run migrations on deploy
- Seed products after initial deploy

---

## Launch Checklist

### Pre-Launch
- [ ] Set real WhatsApp number in settings
- [ ] Set real phone number in settings
- [ ] Set real email address in settings
- [ ] Set real physical address in settings
- [ ] Upload all product images to `/images/products/`
- [ ] Run `pnpm map:product-images` to map images
- [ ] Run `pnpm seed:products` to seed database
- [ ] Run `pnpm verify:assets` to verify images
- [ ] Test Akü Bulucu (Battery Finder) functionality
- [ ] Test Contact page CTAs (WhatsApp, Phone)
- [ ] Test Admin panel login and CRUD operations

### Post-Launch
- [ ] Monitor API logs for errors
- [ ] Verify all product images load correctly
- [ ] Test all pages on mobile and desktop
- [ ] Verify WhatsApp CTAs work
- [ ] Check SEO meta tags

---

## Admin Panel Notes

- Access at `/admin`
- Protected by `ADMIN_PASSWORD`
- Supports CRUD operations for batteries
- View and update product data
- No e-commerce features (no prices, stock, cart)

---

## Known Launch Blockers

None at this time.

---

## Content Safety

- All UI text must remain in Turkish
- No English text leakage
- No mojibake
- No e-commerce language (prices, stock, cart, checkout)
- No fake specs or images
- Brand identity must be preserved

---

## Asset Requirements

- Product images: High-resolution PNG/WebP/JPG
- Favicon: `/favicon.svg`
- Apple touch icon: `/apple-touch-icon.svg`
- OG image: `/images/og/og-image.png`
- Hero images: `/images/hero/hero-1.png`, etc.
- Brand assets: `/public/brand/`

---

## Troubleshooting

### Product Images Not Loading
1. Check image exists in `/images/products/`
2. Check naming matches SKU exactly
3. Run `pnpm verify:assets` to verify all images
4. Check `product-image-manifest.json` for correct mapping

### Admin Panel Not Accessible
1. Verify `ADMIN_PASSWORD` is set
2. Check API server is running
3. Check API token is valid

### Akü Bulucu Not Working
1. Verify database has product data
2. Check API server is running
3. Test API endpoints directly
