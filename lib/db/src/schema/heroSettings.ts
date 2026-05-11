import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const heroSettingsTable = pgTable("hero_settings", {
  id: serial("id").primaryKey(),
  title: text("title"),
  subtitle: text("subtitle"),
  cta1Text: text("cta1_text"),
  cta1Link: text("cta1_link"),
  cta2Text: text("cta2_text"),
  cta2Link: text("cta2_link"),
  bgImageUrl: text("bg_image_url"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertHeroSettingsSchema = createInsertSchema(heroSettingsTable).omit({ id: true, updatedAt: true });
export type InsertHeroSettings = z.infer<typeof insertHeroSettingsSchema>;
export type HeroSettings = typeof heroSettingsTable.$inferSelect;
