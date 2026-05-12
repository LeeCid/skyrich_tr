# Production Environment Variables Template

**IMPORTANT:** Never commit real secrets. Use this template only.

---

## API Environment Variables

```bash
NODE_ENV=production
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB
PORT=8080
ADMIN_PASSWORD=CHANGE_ME_STRONG
ADMIN_API_TOKEN=CHANGE_ME_RANDOM_64_CHARS
FRONTEND_ORIGIN=https://www.skyrichbattery.com.tr
```

---

## Frontend Environment Variables

```bash
VITE_API_BASE_URL=https://api.skyrichbattery.com.tr
BASE_PATH=/
```

---

## Security Note

- Replace all placeholders with actual production values before deployment
- Never commit real DATABASE_URL, ADMIN_PASSWORD, or ADMIN_API_TOKEN
- Use strong passwords and random tokens
