import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const portfolioSkillsTable = pgTable("portfolio_skills", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  skills: text("skills").array().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
});

export type PortfolioSkillRow = typeof portfolioSkillsTable.$inferSelect;
export type InsertPortfolioSkillRow = typeof portfolioSkillsTable.$inferInsert;
