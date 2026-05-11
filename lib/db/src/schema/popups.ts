import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const popupsTable = pgTable("popups", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content"),
  imageUrl: text("image_url"),
  buttonText: text("button_text"),
  buttonUrl: text("button_url"),
  active: boolean("active").notNull().default(true),
  showOnce: boolean("show_once").notNull().default(true),
  delaySeconds: integer("delay_seconds").notNull().default(3),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPopupSchema = createInsertSchema(popupsTable).omit({ id: true, createdAt: true });
export type InsertPopup = z.infer<typeof insertPopupSchema>;
export type Popup = typeof popupsTable.$inferSelect;
