import type { Request, Response, NextFunction } from "express";

const ADMIN_API_TOKEN = process.env.ADMIN_API_TOKEN;

export default function requireAdminAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!ADMIN_API_TOKEN) {
    req.log.error(
      { err: new Error("ADMIN_API_TOKEN is not configured") },
      "Server configuration error: ADMIN_API_TOKEN missing",
    );
    res.status(503).json({ error: "Service unavailable: admin auth not configured" });
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: missing or invalid Authorization header" });
    return;
  }

  const token = authHeader.slice("Bearer ".length).trim();
  if (token !== ADMIN_API_TOKEN) {
    res.status(401).json({ error: "Unauthorized: invalid token" });
    return;
  }

  next();
}
