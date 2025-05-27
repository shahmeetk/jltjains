// Local storage utilities for GitHub Pages deployment
import type { Contributor } from "@shared/schema";

const STORAGE_KEY = 'jlt-contributors';

export const localStorageAPI = {
  // Get all contributors from localStorage
  getContributors: (): Contributor[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  // Add a new contributor
  addContributor: (name: string): Contributor => {
    const contributors = localStorageAPI.getContributors();
    const newContributor: Contributor = {
      id: Date.now(), // Simple ID generation for demo
      name: name.trim(),
      createdAt: new Date().toISOString()
    };
    
    contributors.push(newContributor);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contributors));
    return newContributor;
  },

  // Update a contributor
  updateContributor: (id: number, name: string): Contributor | null => {
    const contributors = localStorageAPI.getContributors();
    const index = contributors.findIndex(c => c.id === id);
    
    if (index === -1) return null;
    
    contributors[index] = {
      ...contributors[index],
      name: name.trim()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contributors));
    return contributors[index];
  },

  // Delete a contributor
  deleteContributor: (id: number): boolean => {
    const contributors = localStorageAPI.getContributors();
    const filtered = contributors.filter(c => c.id !== id);
    
    if (filtered.length === contributors.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  // Get contributor count
  getCount: (): number => {
    return localStorageAPI.getContributors().length;
  },

  // Initialize with sample data if empty
  initializeSampleData: () => {
    const existing = localStorageAPI.getContributors();
    if (existing.length === 0) {
      const sampleData = [
        'JLT Jain Sangh Dubai',
        'Jain Allied Science DMCC',
        'Community Member 1',
        'Community Member 2'
      ];
      
      sampleData.forEach(name => {
        localStorageAPI.addContributor(name);
      });
    }
  }
};
