import { contributors, type Contributor, type InsertContributor } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getContributors(): Promise<Contributor[]>;
  getContributorByName(name: string): Promise<Contributor | undefined>;
  createContributor(contributor: InsertContributor): Promise<Contributor>;
  getContributorCount(): Promise<number>;
  deleteContributor(id: number): Promise<boolean>;
  updateContributorName(id: number, name: string): Promise<Contributor | null>;
}

export class DatabaseStorage implements IStorage {
  async getContributors(): Promise<Contributor[]> {
    return await db.select().from(contributors);
  }

  async getContributorByName(name: string): Promise<Contributor | undefined> {
    const [contributor] = await db.select().from(contributors).where(eq(contributors.name, name));
    return contributor || undefined;
  }

  async createContributor(insertContributor: InsertContributor): Promise<Contributor> {
    const [contributor] = await db
      .insert(contributors)
      .values(insertContributor)
      .returning();
    return contributor;
  }

  async getContributorCount(): Promise<number> {
    const result = await db.select().from(contributors);
    return result.length;
  }

  async deleteContributor(id: number): Promise<boolean> {
    const result = await db.delete(contributors).where(eq(contributors.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async updateContributorName(id: number, name: string): Promise<Contributor | null> {
    const [updatedContributor] = await db
      .update(contributors)
      .set({ name })
      .where(eq(contributors.id, id))
      .returning();
    return updatedContributor || null;
  }
}

export const storage = new DatabaseStorage();
