import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const portfolioProfileTable = pgTable("portfolio_profile", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  tagline: text("tagline").notNull(),
  about: text("about").notNull(),
});

export type PortfolioProfile = typeof portfolioProfileTable.$inferSelect;
export type InsertPortfolioProfile = typeof portfolioProfileTable.$inferInsert;
