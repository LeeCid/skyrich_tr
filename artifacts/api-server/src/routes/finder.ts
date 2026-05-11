import { Router } from "express";
import { db, vehicleCompatibilityTable, batteriesTable } from "@workspace/db";
import { eq, and, lte, gte, ilike } from "drizzle-orm";
import { CreateVehicleCompatibilityBody, GetVehicleModelsQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/finder/makes", async (req, res) => {
  try {
    const rows = await db
      .selectDistinct({ vehicleMake: vehicleCompatibilityTable.vehicleMake })
      .from(vehicleCompatibilityTable)
      .orderBy(vehicleCompatibilityTable.vehicleMake);
    res.json(rows.map(r => r.vehicleMake));
  } catch (err) {
    req.log.error({ err }, "Failed to get vehicle makes");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/finder/models", async (req, res) => {
  try {
    const query = GetVehicleModelsQueryParams.safeParse(req.query);
    if (!query.success) {
      res.status(400).json({ error: "make parameter required" });
      return;
    }
    const rows = await db
      .selectDistinct({ vehicleModel: vehicleCompatibilityTable.vehicleModel })
      .from(vehicleCompatibilityTable)
      .where(ilike(vehicleCompatibilityTable.vehicleMake, query.data.make))
      .orderBy(vehicleCompatibilityTable.vehicleModel);
    res.json(rows.map(r => r.vehicleModel));
  } catch (err) {
    req.log.error({ err }, "Failed to get vehicle models");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/finder/search", async (req, res) => {
  try {
    const { make, model, year } = req.query as { make?: string; model?: string; year?: string };
    const yearNum = year ? parseInt(year) : undefined;

    let compatRows = await db
      .select()
      .from(vehicleCompatibilityTable)
      .innerJoin(batteriesTable, eq(vehicleCompatibilityTable.batteryId, batteriesTable.id));

    if (make) {
      compatRows = compatRows.filter(r =>
        r.vehicle_compatibility.vehicleMake.toLowerCase() === make.toLowerCase()
      );
    }
    if (model) {
      compatRows = compatRows.filter(r =>
        r.vehicle_compatibility.vehicleModel.toLowerCase() === model.toLowerCase()
      );
    }
    if (yearNum) {
      compatRows = compatRows.filter(r =>
        r.vehicle_compatibility.yearFrom <= yearNum && r.vehicle_compatibility.yearTo >= yearNum
      );
    }

    const results = compatRows.map(r => ({
      battery: r.batteries,
      compatibility: r.vehicle_compatibility,
    }));

    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Failed to find batteries");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/vehicle-compatibility", async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(vehicleCompatibilityTable)
      .orderBy(vehicleCompatibilityTable.vehicleMake, vehicleCompatibilityTable.vehicleModel);
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to list vehicle compatibility");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/vehicle-compatibility", async (req, res) => {
  try {
    const body = CreateVehicleCompatibilityBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const [entry] = await db.insert(vehicleCompatibilityTable).values(body.data).returning();
    res.status(201).json(entry);
  } catch (err) {
    req.log.error({ err }, "Failed to create vehicle compatibility");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/vehicle-compatibility/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    await db.delete(vehicleCompatibilityTable).where(eq(vehicleCompatibilityTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete vehicle compatibility");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
