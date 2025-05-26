import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const contributors = pgTable("contributors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const insertContributorSchema = createInsertSchema(contributors).pick({
  name: true,
}).extend({
  name: z.string().min(2, "Name must be at least 2 characters").max(30, "Name must be at most 30 characters").regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
});

export type InsertContributor = z.infer<typeof insertContributorSchema>;
export type Contributor = typeof contributors.$inferSelect;
