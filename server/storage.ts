import { contributors, type Contributor, type InsertContributor } from "@shared/schema";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

export interface IStorage {
  getContributors(): Promise<Contributor[]>;
  createContributor(contributor: InsertContributor): Promise<Contributor>;
  getContributorCount(): Promise<number>;
  deleteContributor(id: number): Promise<boolean>;
  updateContributorName(id: number, name: string): Promise<Contributor | null>;
}

// In-memory storage for local development
export class InMemoryStorage implements IStorage {
  private contributors: Contributor[] = [];
  private nextId = 1;

  async getContributors(): Promise<Contributor[]> {
    return [...this.contributors];
  }

  async createContributor(insertContributor: InsertContributor): Promise<Contributor> {
    const contributor: Contributor = {
      id: this.nextId++,
      name: insertContributor.name,
    };
    this.contributors.push(contributor);
    return contributor;
  }

  async getContributorCount(): Promise<number> {
    return this.contributors.length;
  }

  async deleteContributor(id: number): Promise<boolean> {
    const index = this.contributors.findIndex(c => c.id === id);
    if (index !== -1) {
      this.contributors.splice(index, 1);
      return true;
    }
    return false;
  }

  async updateContributorName(id: number, name: string): Promise<Contributor | null> {
    const contributor = this.contributors.find(c => c.id === id);
    if (contributor) {
      contributor.name = name;
      return contributor;
    }
    return null;
  }
}

// CSV storage for persistent local development
export class CSVStorage implements IStorage {
  private csvPath: string;
  private nextId: number = 1;

  constructor() {
    this.csvPath = path.join(process.cwd(), "data", "contributors.csv");
    this.ensureDataDirectory();
    this.loadNextId();
  }

  private ensureDataDirectory(): void {
    const dataDir = path.dirname(this.csvPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  private loadNextId(): void {
    try {
      if (fs.existsSync(this.csvPath)) {
        const contributors = this.readCSV();
        if (contributors.length > 0) {
          this.nextId = Math.max(...contributors.map(c => c.id)) + 1;
        }
      }
    } catch (error) {
      console.error("Error loading next ID:", error);
    }
  }

  private readCSV(): Contributor[] {
    try {
      if (!fs.existsSync(this.csvPath)) {
        return [];
      }

      const csvContent = fs.readFileSync(this.csvPath, "utf-8");
      if (!csvContent.trim()) {
        return [];
      }

      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        cast: (value: any, context: any) => {
          if (context.column === "id") {
            return parseInt(value, 10);
          }
          return value;
        }
      });

      return records as Contributor[];
    } catch (error) {
      console.error("Error reading CSV:", error);
      return [];
    }
  }

  private writeCSV(contributors: Contributor[]): void {
    try {
      const csvContent = stringify(contributors, {
        header: true,
        columns: ["id", "name"]
      });
      fs.writeFileSync(this.csvPath, csvContent, "utf-8");
    } catch (error) {
      console.error("Error writing CSV:", error);
      throw new Error("Failed to save data to CSV");
    }
  }

  async getContributors(): Promise<Contributor[]> {
    return this.readCSV();
  }

  async createContributor(insertContributor: InsertContributor): Promise<Contributor> {
    const contributors = this.readCSV();
    const contributor: Contributor = {
      id: this.nextId++,
      name: insertContributor.name,
    };
    contributors.push(contributor);
    this.writeCSV(contributors);
    return contributor;
  }

  async getContributorCount(): Promise<number> {
    const contributors = this.readCSV();
    return contributors.length;
  }

  async deleteContributor(id: number): Promise<boolean> {
    const contributors = this.readCSV();
    const index = contributors.findIndex(c => c.id === id);
    if (index !== -1) {
      contributors.splice(index, 1);
      this.writeCSV(contributors);
      return true;
    }
    return false;
  }

  async updateContributorName(id: number, name: string): Promise<Contributor | null> {
    const contributors = this.readCSV();
    const contributor = contributors.find(c => c.id === id);
    if (contributor) {
      contributor.name = name;
      this.writeCSV(contributors);
      return contributor;
    }
    return null;
  }
}

// Database storage for production
export class DatabaseStorage implements IStorage {
  private db: any;

  constructor() {
    // Only import db if DATABASE_URL is available
    if (process.env.DATABASE_URL) {
      this.db = require("./db").db;
    }
  }

  async getContributors(): Promise<Contributor[]> {
    return await this.db.select().from(contributors);
  }

  async createContributor(insertContributor: InsertContributor): Promise<Contributor> {
    const [contributor] = await this.db
      .insert(contributors)
      .values(insertContributor)
      .returning();
    return contributor;
  }

  async getContributorCount(): Promise<number> {
    const result = await this.db.select().from(contributors);
    return result.length;
  }

  async deleteContributor(id: number): Promise<boolean> {
    const result = await this.db.delete(contributors).where(eq(contributors.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async updateContributorName(id: number, name: string): Promise<Contributor | null> {
    const [updatedContributor] = await this.db
      .update(contributors)
      .set({ name })
      .where(eq(contributors.id, id))
      .returning();
    return updatedContributor || null;
  }
}

// Use CSV storage for local development, database storage for production
export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new CSVStorage();
