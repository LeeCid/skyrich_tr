import { Router } from "express";
import { db, batteriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateBatteryBody, UpdateBatteryBody, ListBatteriesQueryParams } from "@workspace/api-zod";
import requireAdminAuth from "../middleware/require-admin-auth";

const APPROVED_PUBLIC_SKUS = new Set([
  "HJTX9-FP",
  "HJTX14H-FP",
  "HJTZ10S-FP",
  "HJTZ14S-FPZ",
  "HJTZ14S-FP",
  "HJ51913-FP",
  "HJTX20HQ-FP",
  "HJTZ7S-FPZ",
  "HJTX20CH-FP",
  "HJ13L-FPZ",
  "HJT9B-FP",
  "HJT7B-FPZ",
]);

function isPublicApproved(battery: typeof batteriesTable.$inferSelect): boolean {
  return battery.active === true && APPROVED_PUBLIC_SKUS.has(battery.modelCode);
}

const router = Router();

router.get("/batteries", async (req, res) => {
  try {
    const query = ListBatteriesQueryParams.safeParse(req.query);
    let batteries = await db.select().from(batteriesTable).orderBy(batteriesTable.sortOrder, batteriesTable.id);

    batteries = batteries.filter(b => isPublicApproved(b));

    if (query.success && query.data.featured !== undefined) {
      batteries = batteries.filter(b => b.featured === query.data.featured);
    }
    if (query.success && query.data.category !== undefined) {
      batteries = batteries.filter(b => b.type === query.data.category);
    }

    res.json(batteries);
  } catch (err) {
    req.log.error({ err }, "Failed to list batteries");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/batteries", requireAdminAuth, async (req, res) => {
  try {
    const body = CreateBatteryBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const [battery] = await db.insert(batteriesTable).values(body.data).returning();
    res.status(201).json(battery);
  } catch (err) {
    req.log.error({ err }, "Failed to create battery");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/batteries/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const [battery] = await db.select().from(batteriesTable).where(eq(batteriesTable.id, id));
    if (!battery || !isPublicApproved(battery)) {
      res.status(404).json({ error: "Battery not found" });
      return;
    }
    res.json(battery);
  } catch (err) {
    req.log.error({ err }, "Failed to get battery");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/batteries/:id", requireAdminAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const body = UpdateBatteryBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const [battery] = await db.update(batteriesTable).set(body.data).where(eq(batteriesTable.id, id)).returning();
    if (!battery) {
      res.status(404).json({ error: "Battery not found" });
      return;
    }
    res.json(battery);
  } catch (err) {
    req.log.error({ err }, "Failed to update battery");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/batteries/:id", requireAdminAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    await db.delete(batteriesTable).where(eq(batteriesTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete battery");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/sitemap.xml", async (req, res) => {
  try {
    const batteries = await db.select().from(batteriesTable).orderBy(batteriesTable.sortOrder, batteriesTable.id);
    const approvedBatteries = batteries.filter(b => isPublicApproved(b));

    const baseUrl = "https://www.skyrichbattery.com.tr";
    const staticUrls = [
      { loc: `${baseUrl}/`, changefreq: "weekly", priority: "1.0" },
      { loc: `${baseUrl}/urunler`, changefreq: "weekly", priority: "0.8" },
      { loc: `${baseUrl}/aku-bulucu`, changefreq: "monthly", priority: "0.6" },
      { loc: `${baseUrl}/hakkimizda`, changefreq: "monthly", priority: "0.5" },
      { loc: `${baseUrl}/iletisim`, changefreq: "monthly", priority: "0.5" },
    ];

    const productUrls = approvedBatteries.map(b => ({
      loc: `${baseUrl}/urunler/${b.id}`,
      changefreq: "weekly",
      priority: "0.7",
    }));

    const allUrls = [...staticUrls, ...productUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    req.log.error({ err }, "Failed to generate sitemap");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
