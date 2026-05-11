# Skyrich Battery TR

Turkish official distributor catalog website for Skyrich lithium batteries.

## Security Setup (Required Before First Run)

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Set required secrets in `.env`:
   - `ADMIN_PASSWORD` — strong password for the admin panel login
   - `ADMIN_API_TOKEN` — long random secret string (64+ characters recommended). This token is returned by `/api/admin/login` and must be sent as `Authorization: Bearer <token>` on all admin endpoints.
   - `DATABASE_URL` — PostgreSQL connection string

3. **Never commit secrets.** `.env` is already ignored by `.gitignore`.

4. **Do not launch the public site before these environment variables are configured.**

## Admin Access

- URL: `/admin`
- Credentials: the `ADMIN_PASSWORD` you configured
- After login, the frontend stores the bearer token in `localStorage` under key `admin_token`

## Architecture

- **Frontend:** React + Vite + Tailwind CSS + shadcn/ui (SPA)
- **API:** Express 5 + Drizzle ORM + PostgreSQL
- **Auth:** Bearer token in `Authorization` header (V1 simple approach)
- **Workspace:** pnpm monorepo

## Quick Start

```bash
# Install dependencies
pnpm install

# Run typecheck
pnpm run typecheck

# Build everything
pnpm run build
```

See `replit.md` for additional run commands.
