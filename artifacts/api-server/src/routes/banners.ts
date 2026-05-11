import { Router } from "express";
import { db, bannersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateBannerBody, UpdateBannerBody, ListBannersQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/banners", async (req, res) => {
  try {
    const query = ListBannersQueryParams.safeParse(req.query);
    let banners = await db.select().from(bannersTable).orderBy(bannersTable.sortOrder, bannersTable.id);

    if (query.success && query.data.active !== undefined) {
      banners = banners.filter(b => b.active === query.data.active);
    }

    res.json(banners);
  } catch (err) {
    req.log.error({ err }, "Failed to list banners");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/banners", async (req, res) => {
  try {
    const body = CreateBannerBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const [banner] = await db.insert(bannersTable).values(body.data).returning();
    res.status(201).json(banner);
  } catch (err) {
    req.log.error({ err }, "Failed to create banner");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/banners/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const body = UpdateBannerBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const [banner] = await db.update(bannersTable).set(body.data).where(eq(bannersTable.id, id)).returning();
    if (!banner) {
      res.status(404).json({ error: "Banner not found" });
      return;
    }
    res.json(banner);
  } catch (err) {
    req.log.error({ err }, "Failed to update banner");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/banners/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    await db.delete(bannersTable).where(eq(bannersTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete banner");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
