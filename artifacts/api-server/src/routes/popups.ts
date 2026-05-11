import { Router } from "express";
import { db, popupsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreatePopupBody, UpdatePopupBody, ListPopupsQueryParams } from "@workspace/api-zod";
import requireAdminAuth from "../middleware/require-admin-auth";

const router = Router();

router.get("/popups", async (req, res) => {
  try {
    const query = ListPopupsQueryParams.safeParse(req.query);
    let popups = await db.select().from(popupsTable).orderBy(popupsTable.id);

    if (query.success && query.data.active !== undefined) {
      popups = popups.filter(p => p.active === query.data.active);
    }

    res.json(popups);
  } catch (err) {
    req.log.error({ err }, "Failed to list popups");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/popups", requireAdminAuth, async (req, res) => {
  try {
    const body = CreatePopupBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const [popup] = await db.insert(popupsTable).values(body.data).returning();
    res.status(201).json(popup);
  } catch (err) {
    req.log.error({ err }, "Failed to create popup");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/popups/:id", requireAdminAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const body = UpdatePopupBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const [popup] = await db.update(popupsTable).set(body.data).where(eq(popupsTable.id, id)).returning();
    if (!popup) {
      res.status(404).json({ error: "Popup not found" });
      return;
    }
    res.json(popup);
  } catch (err) {
    req.log.error({ err }, "Failed to update popup");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/popups/:id", requireAdminAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    await db.delete(popupsTable).where(eq(popupsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete popup");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
