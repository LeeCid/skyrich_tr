# Production Environment Variables

## API Service (Railway / Render / VPS)

```bash
NODE_ENV=production
PORT=3000

# PostgreSQL connection string
DATABASE_URL=postgresql://user:password@host:port/database

# Admin credentials — generate strong values before deploying
ADMIN_PASSWORD=your-very-strong-admin-password-here
ADMIN_API_TOKEN=your-64-character-random-bearer-token-here

# CORS origin for the deployed frontend
FRONTEND_ORIGIN=https://www.skyrichbattery.com.tr
```

## Frontend (Vercel)

```bash
# API base URL for production
VITE_API_BASE_URL=https://api.skyrichbattery.com.tr

# Vite build base path
BASE_PATH=/
```

## Domain Plan

| Service | URL |
|---------|-----|
| Primary Frontend | `https://www.skyrichbattery.com.tr` |
| API | `https://api.skyrichbattery.com.tr` |

### Redirects (301)

| From | To |
|------|-----|
| `https://skyrichbattery.com.tr` | `https://www.skyrichbattery.com.tr` |
| `https://www.skyrichpower.com.tr` | `https://www.skyrichbattery.com.tr` |
| `https://skyrichpower.com.tr` | `https://www.skyrichbattery.com.tr` |

Configure these in Cloudflare or your DNS provider.

## Post-Deployment Admin Setup

After the first deploy, log in to `/admin` and update:

1. **Site Settings** tab:
   - WhatsApp number
   - Phone number
   - Email address
   - Physical address
   - Instagram / Facebook URLs
   - SEO title and description

2. **Hero Settings** tab:
   - Hero title and subtitle
   - CTA button texts and links
   - Background image URL

3. **Popup** tab:
   - Active popup title, content, CTA
   - WhatsApp button link

4. **Batteries** tab:
   - Upload product images for each SKU
   - Fill verified technical specs from official sources only
   - Mark products as active when ready

5. **Banners** tab:
   - Add homepage carousel banners with images and links

6. **Page Contents** tab:
   - Hakkımızda page text
   - Footer description
   - Contact page intro text

## Security Reminders

- Never commit `.env` files to git
- Rotate `ADMIN_PASSWORD` and `ADMIN_API_TOKEN` if suspected leaked
- The admin panel is intentionally not linked from public navbar/footer
- All admin mutations require `Authorization: Bearer <ADMIN_API_TOKEN>`
