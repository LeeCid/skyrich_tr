import { Router } from "express";
import { db, batteriesTable, bannersTable, popupsTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { AdminLoginBody } from "@workspace/api-zod";
import requireAdminAuth from "../middleware/require-admin-auth";

const router = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_API_TOKEN = process.env.ADMIN_API_TOKEN;

router.post("/admin/login", async (req, res) => {
  try {
    if (!ADMIN_PASSWORD) {
      req.log.error(
        { err: new Error("ADMIN_PASSWORD is not configured") },
        "Server configuration error: ADMIN_PASSWORD missing",
      );
      res.status(503).json({ error: "Service unavailable: admin auth not configured" });
      return;
    }

    const body = AdminLoginBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    if (body.data.password !== ADMIN_PASSWORD) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }
    res.json({ success: true, token: ADMIN_API_TOKEN });
  } catch (err) {
    req.log.error({ err }, "Failed to login");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/stats", requireAdminAuth, async (req, res) => {
  try {
    const [totalBatteries] = await db.select({ count: count() }).from(batteriesTable);
    const [activeBatteries] = await db.select({ count: count() }).from(batteriesTable).where(eq(batteriesTable.active, true));
    const [activeBanners] = await db.select({ count: count() }).from(bannersTable).where(eq(bannersTable.active, true));
    const [activePopups] = await db.select({ count: count() }).from(popupsTable).where(eq(popupsTable.active, true));

    res.json({
      totalBatteries: Number(totalBatteries.count),
      activeBatteries: Number(activeBatteries.count),
      activeBanners: Number(activeBanners.count),
      activePopups: Number(activePopups.count),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get admin stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
