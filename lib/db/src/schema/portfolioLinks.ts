import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const portfolioLinksTable = pgTable("portfolio_links", {
  id: serial("id").primaryKey(),
  github: text("github").notNull().default(""),
  linkedin: text("linkedin").notNull().default(""),
  email: text("email").notNull().default(""),
});

export type PortfolioLinks = typeof portfolioLinksTable.$inferSelect;
export type InsertPortfolioLinks = typeof portfolioLinksTable.$inferInsert;
