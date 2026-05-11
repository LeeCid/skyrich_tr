import { Router } from "express";
import { db, batteriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateBatteryBody, UpdateBatteryBody, ListBatteriesQueryParams } from "@workspace/api-zod";
import requireAdminAuth from "../middleware/require-admin-auth";

const router = Router();

router.get("/batteries", async (req, res) => {
  try {
    const query = ListBatteriesQueryParams.safeParse(req.query);
    let batteries = await db.select().from(batteriesTable).orderBy(batteriesTable.sortOrder, batteriesTable.id);

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
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const [battery] = await db.select().from(batteriesTable).where(eq(batteriesTable.id, id));
    if (!battery) {
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
    const id = parseInt(req.params.id);
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
    const id = parseInt(req.params.id);
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

export default router;
