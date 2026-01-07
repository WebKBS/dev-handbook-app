import { READ_STATUS } from "@/enums/readState.enum";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const readState = sqliteTable("read_state", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  docKey: text("doc_key").primaryKey(), // `${domain}:${slug}`
  domain: text("domain").notNull(),
  slug: text("slug").notNull(),

  // status: text("status").notNull(), // "unread" | "in_progress" | "done"
  status: text("status", { enum: READ_STATUS }).notNull().default("unread"),

  lastReadAt: integer("last_read_at"), // epoch ms
  completedAt: integer("completed_at"), // epoch ms
  updatedAt: integer("updated_at").notNull(), // epoch ms
});
