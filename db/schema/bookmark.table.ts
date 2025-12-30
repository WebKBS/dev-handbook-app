import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const bookmarkTable = sqliteTable("bookmark", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  domain: text("domain").notNull(),
  description: text("description"),
});

export type Favorite = typeof bookmarkTable.$inferSelect;
