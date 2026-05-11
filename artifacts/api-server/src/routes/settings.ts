import { Router } from "express";
import { db, siteSettingsTable, heroSettingsTable, pageContentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import requireAdminAuth from "../middleware/require-admin-auth";

const router = Router();

// ─── Site Settings ────────────────────────────────────────────────────────────

router.get("/site-settings", async (req, res) => {
  try {
    const rows = await db.select().from(siteSettingsTable).limit(1);
    if (rows.length === 0) {
      const [row] = await db.insert(siteSettingsTable).values({}).returning();
      res.json(row);
    } else {
      res.json(rows[0]);
    }
  } catch (err) {
    req.log.error({ err }, "Failed to get site settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/site-settings", requireAdminAuth, async (req, res) => {
  try {
    const existing = await db.select().from(siteSettingsTable).limit(1);
    if (existing.length === 0) {
      const [row] = await db.insert(siteSettingsTable).values({ ...req.body, updatedAt: new Date() }).returning();
      res.json(row);
    } else {
      const [row] = await db
        .update(siteSettingsTable)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(siteSettingsTable.id, existing[0].id))
        .returning();
      res.json(row);
    }
  } catch (err) {
    req.log.error({ err }, "Failed to update site settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Hero Settings ────────────────────────────────────────────────────────────

router.get("/hero-settings", async (req, res) => {
  try {
    const rows = await db.select().from(heroSettingsTable).limit(1);
    if (rows.length === 0) {
      const [row] = await db.insert(heroSettingsTable).values({}).returning();
      res.json(row);
    } else {
      res.json(rows[0]);
    }
  } catch (err) {
    req.log.error({ err }, "Failed to get hero settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/hero-settings", requireAdminAuth, async (req, res) => {
  try {
    const existing = await db.select().from(heroSettingsTable).limit(1);
    if (existing.length === 0) {
      const [row] = await db.insert(heroSettingsTable).values({ ...req.body, updatedAt: new Date() }).returning();
      res.json(row);
    } else {
      const [row] = await db
        .update(heroSettingsTable)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(heroSettingsTable.id, existing[0].id))
        .returning();
      res.json(row);
    }
  } catch (err) {
    req.log.error({ err }, "Failed to update hero settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Page Contents ────────────────────────────────────────────────────────────

router.get("/page-contents", async (req, res) => {
  try {
    const rows = await db.select().from(pageContentsTable).orderBy(pageContentsTable.key);
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to list page contents");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/page-contents/:key", async (req, res) => {
  try {
    const [row] = await db.select().from(pageContentsTable).where(eq(pageContentsTable.key, req.params.key));
    if (!row) {
      res.status(404).json({ error: "Page content not found" });
      return;
    }
    res.json(row);
  } catch (err) {
    req.log.error({ err }, "Failed to get page content");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/page-contents/:key", requireAdminAuth, async (req, res) => {
  try {
    const key = req.params.key;
    const existing = await db.select().from(pageContentsTable).where(eq(pageContentsTable.key, key));
    if (existing.length === 0) {
      const [row] = await db.insert(pageContentsTable).values({ key, ...req.body, updatedAt: new Date() }).returning();
      res.json(row);
    } else {
      const [row] = await db
        .update(pageContentsTable)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(pageContentsTable.key, key))
        .returning();
      res.json(row);
    }
  } catch (err) {
    req.log.error({ err }, "Failed to update page content");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
