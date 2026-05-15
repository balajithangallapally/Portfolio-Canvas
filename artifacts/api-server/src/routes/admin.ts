import { Router } from "express";
import { db } from "@workspace/db";
import {
  portfolioProfileTable,
  portfolioProjectsTable,
  portfolioSkillsTable,
  portfolioLinksTable,
  portfolioEducationTable,
} from "@workspace/db/schema";
import { eq, asc } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth.js";

const router = Router();
router.use(requireAuth);

router.get("/admin/profile", async (req: AuthRequest, res) => {
  const [profile] = await db.select().from(portfolioProfileTable).limit(1);
  res.json(profile ?? null);
});

router.put("/admin/profile", async (req: AuthRequest, res) => {
  const { name, role, tagline, about } = req.body ?? {};
  if (!name || !role || !tagline || !about) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }
  try {
    const [existing] = await db.select().from(portfolioProfileTable).limit(1);
    if (existing) {
      const [updated] = await db
        .update(portfolioProfileTable)
        .set({ name, role, tagline, about })
        .where(eq(portfolioProfileTable.id, existing.id))
        .returning();
      res.json(updated);
    } else {
      const [created] = await db.insert(portfolioProfileTable).values({ name, role, tagline, about }).returning();
      res.json(created);
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

router.get("/admin/projects", async (req: AuthRequest, res) => {
  const projects = await db
    .select()
    .from(portfolioProjectsTable)
    .orderBy(asc(portfolioProjectsTable.sortOrder), asc(portfolioProjectsTable.id));
  res.json(projects);
});

router.post("/admin/projects", async (req: AuthRequest, res) => {
  const { name, description, tech, features, github, live, sortOrder } = req.body ?? {};
  if (!name || !description) {
    res.status(400).json({ error: "Name and description are required" });
    return;
  }
  try {
    const [project] = await db
      .insert(portfolioProjectsTable)
      .values({
        name,
        description,
        tech: Array.isArray(tech) ? tech : [],
        features: Array.isArray(features) ? features : [],
        github: github ?? "",
        live: live ?? "",
        sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
      })
      .returning();
    res.status(201).json(project);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create project" });
  }
});

router.put("/admin/projects/:id", async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, description, tech, features, github, live, sortOrder } = req.body ?? {};
  try {
    const [updated] = await db
      .update(portfolioProjectsTable)
      .set({
        name,
        description,
        tech: Array.isArray(tech) ? tech : [],
        features: Array.isArray(features) ? features : [],
        github: github ?? "",
        live: live ?? "",
        sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
      })
      .where(eq(portfolioProjectsTable.id, id))
      .returning();
    if (!updated) { res.status(404).json({ error: "Project not found" }); return; }
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to update project" });
  }
});

router.delete("/admin/projects/:id", async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id, 10);
  await db.delete(portfolioProjectsTable).where(eq(portfolioProjectsTable.id, id));
  res.status(204).send();
});

router.get("/admin/skills", async (req: AuthRequest, res) => {
  const skills = await db.select().from(portfolioSkillsTable).orderBy(asc(portfolioSkillsTable.sortOrder));
  res.json(skills);
});

router.put("/admin/skills", async (req: AuthRequest, res) => {
  const { skills } = req.body ?? {};
  if (!Array.isArray(skills)) {
    res.status(400).json({ error: "skills must be an array" });
    return;
  }
  try {
    await db.delete(portfolioSkillsTable);
    if (skills.length > 0) {
      await db.insert(portfolioSkillsTable).values(
        skills.map((s: any, i: number) => ({
          category: String(s.category),
          skills: Array.isArray(s.skills) ? s.skills : [],
          sortOrder: i,
        }))
      );
    }
    const updated = await db.select().from(portfolioSkillsTable).orderBy(asc(portfolioSkillsTable.sortOrder));
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to update skills" });
  }
});

router.get("/admin/links", async (req: AuthRequest, res) => {
  const [links] = await db.select().from(portfolioLinksTable).limit(1);
  res.json(links ?? null);
});

router.put("/admin/links", async (req: AuthRequest, res) => {
  const { github, linkedin, email } = req.body ?? {};
  try {
    const [existing] = await db.select().from(portfolioLinksTable).limit(1);
    const values = { github: github ?? "", linkedin: linkedin ?? "", email: email ?? "" };
    if (existing) {
      const [updated] = await db
        .update(portfolioLinksTable)
        .set(values)
        .where(eq(portfolioLinksTable.id, existing.id))
        .returning();
      res.json(updated);
    } else {
      const [created] = await db.insert(portfolioLinksTable).values(values).returning();
      res.json(created);
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to update links" });
  }
});

router.get("/admin/education", async (req: AuthRequest, res) => {
  const [edu] = await db.select().from(portfolioEducationTable).limit(1);
  res.json(edu ?? null);
});

router.put("/admin/education", async (req: AuthRequest, res) => {
  const { degree, institute, year } = req.body ?? {};
  if (!degree || !institute || !year) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }
  try {
    const [existing] = await db.select().from(portfolioEducationTable).limit(1);
    if (existing) {
      const [updated] = await db
        .update(portfolioEducationTable)
        .set({ degree, institute, year })
        .where(eq(portfolioEducationTable.id, existing.id))
        .returning();
      res.json(updated);
    } else {
      const [created] = await db.insert(portfolioEducationTable).values({ degree, institute, year }).returning();
      res.json(created);
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to update education" });
  }
});

export default router;
