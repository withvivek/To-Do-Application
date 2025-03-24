import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      
      // Don't return the password
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post("/api/users/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Don't return the password
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Task routes
  app.get("/api/tasks", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Valid userId is required" });
      }
      
      const tasks = await storage.getTasksByUserId(userId);
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      console.log("Task creation request body:", JSON.stringify(req.body));
      
      // Bypass schema validation temporarily and handle the data directly
      const taskData = {
        userId: req.body.userId,
        title: req.body.title,
        description: req.body.description || null,
        priority: req.body.priority || "medium",
        isOutdoor: req.body.isOutdoor || false,
        dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null
      };
      
      console.log("Processed task data:", JSON.stringify(taskData));
      
      // Create the task with processed data
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      console.error("Task creation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to create task", error: String(error) });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      
      if (isNaN(taskId)) {
        return res.status(400).json({ message: "Valid task ID is required" });
      }
      
      await storage.deleteTask(taskId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  app.get("/api/tasks/stats/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Valid userId is required" });
      }
      
      const tasks = await storage.getTasksByUserId(userId);
      
      // Calculate statistics
      const total = tasks.length;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const dueToday = tasks.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        return taskDate >= today && taskDate < tomorrow;
      }).length;
      
      const outdoor = tasks.filter(task => task.isOutdoor).length;
      
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const createdThisWeek = tasks.filter(task => {
        const createdAt = new Date(task.createdAt);
        return createdAt >= weekStart;
      }).length;
      
      // Priority breakdown
      const highPriority = tasks.filter(task => task.priority === "high").length;
      const mediumPriority = tasks.filter(task => task.priority === "medium").length;
      const lowPriority = tasks.filter(task => task.priority === "low").length;
      
      const stats = {
        total,
        dueToday,
        outdoor,
        createdThisWeek,
        priorities: {
          high: highPriority,
          medium: mediumPriority,
          low: lowPriority,
          highPercentage: total > 0 ? Math.round((highPriority / total) * 100) : 0,
          mediumPercentage: total > 0 ? Math.round((mediumPriority / total) * 100) : 0,
          lowPercentage: total > 0 ? Math.round((lowPriority / total) * 100) : 0,
        }
      };
      
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get task statistics" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
