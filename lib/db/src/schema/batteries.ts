import { pgTable, serial, text, boolean, integer, real, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const batteriesTable = pgTable("batteries", {
  id: serial("id").primaryKey(),
  modelCode: text("model_code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  voltage: real("voltage"),
  capacity: real("capacity"),
  cca: integer("cca"),
  type: text("type").notNull().default("motor"),
  technology: text("technology").notNull().default("Lithium"),
  dimensions: text("dimensions"),
  weight: real("weight"),
  chargeCurrent: text("charge_current"),
  imageUrl: text("image_url"),
  applications: text("applications"),
  crossReferenceCodes: jsonb("cross_reference_codes").$type<string[]>(),
  sourceStatus: text("source_status"),
  sourceUrl: text("source_url"),
  sourceNotes: text("source_notes"),
  vehicleHints: jsonb("vehicle_hints").$type<any[]>(),
  active: boolean("active").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBatterySchema = createInsertSchema(batteriesTable).omit({ id: true, createdAt: true });
export type InsertBattery = z.infer<typeof insertBatterySchema>;
export type Battery = typeof batteriesTable.$inferSelect;
