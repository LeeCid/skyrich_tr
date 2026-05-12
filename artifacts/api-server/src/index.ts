import app from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"] ?? "8080";
const host = process.env["HOST"] ?? "0.0.0.0";

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// Parse allowed origins for logging
const frontendOriginEnv = process.env.FRONTEND_ORIGIN ?? "";
const allowedOrigins = frontendOriginEnv
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Safe startup logging (no secrets)
logger.info({
  port,
  host,
  NODE_ENV: process.env.NODE_ENV ?? "development",
  hasDatabaseUrl: !!process.env.DATABASE_URL,
  allowedOriginsCount: allowedOrigins.length,
  allowedOrigins: allowedOrigins,
}, "API server starting");

app.listen(port, host, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port, host }, "Server listening");
});
