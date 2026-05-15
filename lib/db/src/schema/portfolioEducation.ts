import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const portfolioEducationTable = pgTable("portfolio_education", {
  id: serial("id").primaryKey(),
  degree: text("degree").notNull(),
  institute: text("institute").notNull(),
  year: text("year").notNull(),
});

export type PortfolioEducation = typeof portfolioEducationTable.$inferSelect;
export type InsertPortfolioEducation = typeof portfolioEducationTable.$inferInsert;
