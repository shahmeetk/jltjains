import { contributors, type Contributor, type InsertContributor } from "@shared/schema";

export interface IStorage {
  getContributors(): Promise<Contributor[]>;
  getContributorByName(name: string): Promise<Contributor | undefined>;
  createContributor(contributor: InsertContributor): Promise<Contributor>;
  getContributorCount(): Promise<number>;
}

export class MemStorage implements IStorage {
  private contributors: Map<number, Contributor>;
  currentId: number;

  constructor() {
    this.contributors = new Map();
    this.currentId = 1;
  }

  async getContributors(): Promise<Contributor[]> {
    return Array.from(this.contributors.values());
  }

  async getContributorByName(name: string): Promise<Contributor | undefined> {
    return Array.from(this.contributors.values()).find(
      (contributor) => contributor.name.toLowerCase() === name.toLowerCase(),
    );
  }

  async createContributor(insertContributor: InsertContributor): Promise<Contributor> {
    const id = this.currentId++;
    const contributor: Contributor = { ...insertContributor, id };
    this.contributors.set(id, contributor);
    return contributor;
  }

  async getContributorCount(): Promise<number> {
    return this.contributors.size;
  }
}

export const storage = new MemStorage();
