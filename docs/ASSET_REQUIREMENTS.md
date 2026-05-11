# Asset Requirements

This document lists all real assets that must be prepared and uploaded before the production site goes live. **Do not use stock photos or AI-generated images for product photos.**

## Brand Identity

| File | Path | Format | Notes |
|------|------|--------|-------|
| Official logo | `/images/logo.svg` (preferred) or `/images/logo.png` | SVG or PNG | Transparent background, monochrome + full-color variants if possible |
| Favicon | `/favicon.svg` | SVG | Scalable favicon for modern browsers |
| Apple touch icon | `/apple-touch-icon.png` | PNG 180x180 | iOS home-screen icon |
| Open Graph default | `/images/og-default.png` | PNG 1200x630 | Social share preview image |

## Product Images

One image per approved SKU. The seed script expects these paths:

| SKU | Expected Path |
|-----|---------------|
| HJTX9-FP | `/images/products/HJTX9-FP.webp` or `.png` |
| HJTX14H-FP | `/images/products/HJTX14H-FP.webp` or `.png` |
| HJTZ10S-FP | `/images/products/HJTZ10S-FP.webp` or `.png` |
| HJTZ14S-FPZ | `/images/products/HJTZ14S-FPZ.webp` or `.png` |
| HJTZ14S-FP | `/images/products/HJTZ14S-FP.webp` or `.png` |
| HJ51913-FP | `/images/products/HJ51913-FP.webp` or `.png` |
| HJTX20HQ-FP | `/images/products/HJTX20HQ-FP.webp` or `.png` |
| HJTZ7S-FPZ | `/images/products/HJTZ7S-FPZ.webp` or `.png` |
| HJTX20CH-FP | `/images/products/HJTX20CH-FP.webp` or `.png` |
| HJ13L-FPZ | `/images/products/HJ13L-FPZ.webp` or `.png` |
| HJT9B-FP | `/images/products/HJT9B-FP.webp` or `.png` |
| HJT7B-FPZ | `/images/products/HJT7B-FPZ.webp` or `.png` |

**Requirements for product photos:**
- Real product photography (official Skyrich photos or your own studio shots)
- White or transparent background preferred
- Consistent aspect ratio (e.g., 1:1 or 4:3)
- WebP preferred for smaller file size; PNG fallback accepted

## Hero / Homepage

| File | Path | Format | Notes |
|------|------|--------|-------|
| Hero background | `/images/hero-1.png` | PNG or WebP | High-resolution industrial or motorcycle theme |

## Optional Certifications & Downloads

| File | Path | Format | Notes |
|------|------|--------|-------|
| Certifications | `/images/certifications.pdf` | PDF | CE, UL, or other official certs |
| User manual | `/images/manual.pdf` | PDF | Product installation guide |

## Verification

Run the asset checker before deployment:

```bash
pnpm --filter @workspace/scripts run verify:assets
```

Exit code `0` means all required files are present.
