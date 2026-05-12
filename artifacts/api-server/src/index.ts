import app from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"] ?? "8080";
const host = process.env["HOST"] ?? "0.0.0.0";

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// Runtime logging
logger.info({
  port,
  host,
  NODE_ENV: process.env.NODE_ENV ?? "development",
  hasDatabaseUrl: !!process.env.DATABASE_URL,
  hasAdminPassword: !!process.env.ADMIN_PASSWORD,
  hasAdminApiToken: !!process.env.ADMIN_API_TOKEN,
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "not set",
}, "API server starting");

app.listen(port, host, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port, host }, "Server listening");
});
