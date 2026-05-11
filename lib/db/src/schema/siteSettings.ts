import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const siteSettingsTable = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  whatsapp: text("whatsapp"),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  instagram: text("instagram"),
  facebook: text("facebook"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  footerDescription: text("footer_description"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettingsTable).omit({ id: true, updatedAt: true });
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type SiteSettings = typeof siteSettingsTable.$inferSelect;
