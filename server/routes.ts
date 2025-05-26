import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContributorSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all contributors
  app.get("/api/contributors", async (req, res) => {
    try {
      const contributors = await storage.getContributors();
      res.json(contributors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contributors" });
    }
  });

  // Get contributor count
  app.get("/api/contributors/count", async (req, res) => {
    try {
      const count = await storage.getContributorCount();
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contributor count" });
    }
  });

  // Add a new contributor
  app.post("/api/contributors", async (req, res) => {
    try {
      const validatedData = insertContributorSchema.parse(req.body);
      
      // Check if contributor already exists
      const existingContributor = await storage.getContributorByName(validatedData.name);
      if (existingContributor) {
        return res.status(400).json({ message: "This name has already been added to the wall" });
      }

      // Check if we've reached the maximum number of contributors
      const currentCount = await storage.getContributorCount();
      if (currentCount >= 54) {
        return res.status(400).json({ message: "Maximum number of contributors reached" });
      }

      const contributor = await storage.createContributor(validatedData);
      res.status(201).json(contributor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors[0]?.message || "Invalid name format";
        return res.status(400).json({ message: errorMessage });
      }
      res.status(500).json({ message: "Failed to add contributor" });
    }
  });

  // Delete a contributor
  app.delete("/api/contributors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid contributor ID" });
      }

      const deleted = await storage.deleteContributor(id);
      if (!deleted) {
        return res.status(404).json({ message: "Contributor not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete contributor" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
