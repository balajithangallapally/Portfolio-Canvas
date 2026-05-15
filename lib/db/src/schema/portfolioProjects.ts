import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const portfolioProjectsTable = pgTable("portfolio_projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  tech: text("tech").array().notNull().default([]),
  features: text("features").array().notNull().default([]),
  github: text("github").notNull().default(""),
  live: text("live").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

export type PortfolioProject = typeof portfolioProjectsTable.$inferSelect;
export type InsertPortfolioProject = typeof portfolioProjectsTable.$inferInsert;
