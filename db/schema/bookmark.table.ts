import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const bookmarkTable = sqliteTable("bookmark", {
  id: integer().primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  domain: text("domain").notNull(),
  description: text("description"),
});

export type Bookmark = typeof bookmarkTable.$inferSelect;
