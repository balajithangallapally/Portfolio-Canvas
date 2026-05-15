import { Router } from "express";
import { db } from "@workspace/db";
import {
  portfolioProfileTable,
  portfolioProjectsTable,
  portfolioSkillsTable,
  portfolioLinksTable,
  portfolioEducationTable,
} from "@workspace/db/schema";
import { asc } from "drizzle-orm";

const router = Router();

router.get("/portfolio", async (req, res) => {
  try {
    const [profile] = await db.select().from(portfolioProfileTable).limit(1);
    const projects = await db
      .select()
      .from(portfolioProjectsTable)
      .orderBy(asc(portfolioProjectsTable.sortOrder), asc(portfolioProjectsTable.id));
    const skills = await db
      .select()
      .from(portfolioSkillsTable)
      .orderBy(asc(portfolioSkillsTable.sortOrder), asc(portfolioSkillsTable.id));
    const [links] = await db.select().from(portfolioLinksTable).limit(1);
    const [education] = await db.select().from(portfolioEducationTable).limit(1);

    res.json({ profile: profile ?? null, projects, skills, links: links ?? null, education: education ?? null });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch portfolio data" });
  }
});

export default router;
