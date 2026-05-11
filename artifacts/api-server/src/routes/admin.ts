import { Router } from "express";
import { db, batteriesTable, bannersTable, popupsTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { AdminLoginBody } from "@workspace/api-zod";

const router = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "skyrich2025";
const ADMIN_TOKEN = "skyrich-admin-token-2025";

router.post("/admin/login", async (req, res) => {
  try {
    const body = AdminLoginBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    if (body.data.password !== ADMIN_PASSWORD) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }
    res.json({ success: true, token: ADMIN_TOKEN });
  } catch (err) {
    req.log.error({ err }, "Failed to login");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/stats", async (req, res) => {
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
