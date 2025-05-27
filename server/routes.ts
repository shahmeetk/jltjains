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

      // Check if we've reached the maximum number of contributors
      const currentCount = await storage.getContributorCount();
      if (currentCount >= 54) {
        return res.status(400).json({ message: "Maximum number of contributors reached" });
      }

      const contributor = await storage.createContributor(validatedData);
      res.status(201).json(contributor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors[0]?.message || "Invalid input format";
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

  // Update contributor name
  app.patch("/api/contributors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid contributor ID" });
      }

      const { name } = req.body;
      if (!name || typeof name !== 'string') {
        return res.status(400).json({ message: "Name is required" });
      }

      // Basic validation for name
      if (name.length < 1 || name.length > 200) {
        return res.status(400).json({ message: "Name or URL must be between 1 and 200 characters" });
      }

      const updatedContributor = await storage.updateContributorName(id, name);
      if (!updatedContributor) {
        return res.status(404).json({ message: "Contributor not found" });
      }

      res.json(updatedContributor);
    } catch (error) {
      res.status(500).json({ message: "Failed to update contributor" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
