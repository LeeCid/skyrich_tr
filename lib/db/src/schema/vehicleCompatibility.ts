import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { batteriesTable } from "./batteries";

export const vehicleCompatibilityTable = pgTable("vehicle_compatibility", {
  id: serial("id").primaryKey(),
  batteryId: integer("battery_id").notNull().references(() => batteriesTable.id, { onDelete: "cascade" }),
  vehicleMake: text("vehicle_make").notNull(),
  vehicleModel: text("vehicle_model").notNull(),
  yearFrom: integer("year_from").notNull(),
  yearTo: integer("year_to").notNull(),
  engineCc: integer("engine_cc"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertVehicleCompatibilitySchema = createInsertSchema(vehicleCompatibilityTable).omit({ id: true, createdAt: true });
export type InsertVehicleCompatibility = z.infer<typeof insertVehicleCompatibilitySchema>;
export type VehicleCompatibility = typeof vehicleCompatibilityTable.$inferSelect;
