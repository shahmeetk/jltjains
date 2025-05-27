import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const contributors = pgTable("contributors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const insertContributorSchema = createInsertSchema(contributors).pick({
  name: true,
}).extend({
  name: z.string().min(1, "Name or URL must be at least 1 character").max(200, "Name or URL must be at most 200 characters")
});

export type InsertContributor = z.infer<typeof insertContributorSchema>;
export type Contributor = typeof contributors.$inferSelect;
