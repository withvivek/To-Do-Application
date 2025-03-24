import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
});

// Task model
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority").notNull().default("medium"),
  isOutdoor: boolean("is_outdoor").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  dueDate: timestamp("due_date"),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  userId: true,
  title: true,
  description: true,
  priority: true,
  isOutdoor: true,
  dueDate: true,
}).transform((data) => {
  // Handle dueDate conversion from string to Date if needed
  if (data.dueDate && typeof data.dueDate === 'string') {
    return {
      ...data,
      dueDate: new Date(data.dueDate)
    };
  }
  
  // Ensure description is never undefined
  return {
    ...data,
    description: data.description || null,
    priority: data.priority || 'medium',
    isOutdoor: data.isOutdoor !== undefined ? data.isOutdoor : false
  };
});

export const updateTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  description: true,
  priority: true,
  isOutdoor: true,
  dueDate: true,
}).partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;
export type Task = typeof tasks.$inferSelect;
