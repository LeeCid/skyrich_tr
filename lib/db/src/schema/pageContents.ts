import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const pageContentsTable = pgTable("page_contents", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  title: text("title"),
  content: text("content"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPageContentSchema = createInsertSchema(pageContentsTable).omit({ id: true, updatedAt: true });
export type InsertPageContent = z.infer<typeof insertPageContentSchema>;
export type PageContent = typeof pageContentsTable.$inferSelect;
