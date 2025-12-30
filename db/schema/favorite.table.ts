import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const favoriteTable = sqliteTable("favorite", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  description: text("description"),
});

export type Favorite = typeof favoriteTable.$inferSelect;
