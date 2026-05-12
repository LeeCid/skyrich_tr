# Asset Requirements

This document lists all real assets that must be prepared and uploaded before the production site goes live.

**Hard rule:** Do not use stock photos, AI-generated images, or unapproved placeholder images for product photos. Every product image must be an official Skyrich product photo or a photo explicitly approved by the Türkiye distributor.

## Folder Structure

All assets live under `artifacts/skyrich-tr/public/`:

```
public/
  brand/
    skyrich-logo.svg          (preferred)
    skyrich-logo.png          (PNG fallback)
  favicon.svg
  apple-touch-icon.png
  images/
    og/
      og-default.png
    hero/
      hero-1.png
    products/
      HJTX9-FP.webp
      HJTX14H-FP.webp
      ... (12 SKUs total)
  docs/
    certifications.pdf
    manual.pdf
```

## Brand Identity

| File | Exact Path | Format | Recommended Size | Current Status |
|------|-----------|--------|------------------|----------------|
| Official logo (preferred) | `/brand/skyrich-logo.svg` | SVG | vector | ✓ Present |
| Official logo (fallback) | `/brand/skyrich-logo.png` | PNG | 800×200 px | — SVG present |
| Favicon | `/favicon.svg` | SVG | 32×32 px | ✓ Present |
| Apple touch icon | `/apple-touch-icon.png` | PNG | 180×180 px | — Optional (lenient mode) |
| Open Graph default | `/images/og/og-default.png` | PNG | 1200×630 px | — Using /opengraph.jpg fallback |
| Open Graph fallback | `/images/og/og-default.jpg` | JPG | 1200×630 px | ✓ Present (copied from opengraph.jpg) |

## Product Images

One image per approved SKU. The seed script references these paths:

| SKU | Exact Path | Format | Recommended Size |
|-----|-----------|--------|-----------------|
| HJTX9-FP | `/images/products/HJTX9-FP.webp` or `.png` | WebP or PNG | 800×800 px |
| HJTX14H-FP | `/images/products/HJTX14H-FP.webp` or `.png` | WebP or PNG | 800×800 px |
| HJTZ10S-FP | `/images/products/HJTZ10S-FP.webp` or `.png` | WebP or PNG | 800×800 px |
| HJTZ14S-FPZ | `/images/products/HJTZ14S-FPZ.webp` or `.png` | WebP or PNG | 800×800 px |
| HJTZ14S-FP | `/images/products/HJTZ14S-FP.webp` or `.png` | WebP or PNG | 800×800 px |
| HJ51913-FP | `/images/products/HJ51913-FP.webp` or `.png` | WebP or PNG | 800×800 px |
| HJTX20HQ-FP | `/images/products/HJTX20HQ-FP.webp` or `.png` | WebP or PNG | 800×800 px |
| HJTZ7S-FPZ | `/images/products/HJTZ7S-FPZ.webp` or `.png` | WebP or PNG | 800×800 px |
| HJTX20CH-FP | `/images/products/HJTX20CH-FP.webp` or `.png` | WebP or PNG | 800×800 px |
| HJ13L-FPZ | `/images/products/HJ13L-FPZ.webp` or `.png` | WebP or PNG | 800×800 px |
| HJT9B-FP | `/images/products/HJT9B-FP.webp` or `.png` | WebP or PNG | 800×800 px |
| HJT7B-FPZ | `/images/products/HJT7B-FPZ.webp` or `.png` | WebP or PNG | 800×800 px |

**Product photo requirements:**
- Must be real, official Skyrich product photography or distributor-approved studio shots
- White or transparent background preferred
- Consistent aspect ratio (1:1 recommended)
- WebP preferred for smaller file size; PNG fallback accepted
- Do not use AI-generated or stock placeholder images in production

## Hero / Homepage

| File | Exact Path | Format | Recommended Size | Current Status |
|------|-----------|--------|------------------|----------------|
| Hero background | `/images/hero/hero-1.png` | PNG or WebP | 1920×1080 px | ✓ Present (copied from legacy path) |
| Hero legacy | `/images/hero-1.png` | PNG or WebP | 1920×1080 px | ✓ Present (legacy) |

## Optional Certifications & Downloads

| File | Exact Path | Format | Notes |
|------|-----------|--------|-------|
| Certifications | `/docs/certifications.pdf` | PDF | CE, UL, or other official certs |
| User manual | `/docs/manual.pdf` | PDF | Product installation guide |

## Verification

Run the asset checker before deployment:

```bash
# Local dev — product-image warnings only
pnpm --filter @workspace/scripts run verify:assets

# CI / pre-deploy — product-image warnings become errors
STRICT=1 pnpm --filter @workspace/scripts run verify:assets
```

Exit code `0` means all required brand assets are present and (in STRICT mode) all product images are present.
