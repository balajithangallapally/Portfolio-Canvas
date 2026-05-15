import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { adminUsersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { signToken } from "../lib/auth.js";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth.js";

const router = Router();

router.post("/auth/bootstrap", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }
  try {
    // Check if any admin users exist
    const [existingUser] = await db
      .select()
      .from(adminUsersTable)
      .limit(1);

    if (existingUser) {
      res.status(403).json({ error: "Admin user already exists. Cannot bootstrap again." });
      return;
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(String(password), 10);

    // Create the admin user
    const [user] = await db
      .insert(adminUsersTable)
      .values({
        email: String(email).toLowerCase().trim(),
        passwordHash,
      })
      .returning();

    res.status(201).json({ message: "Admin user created successfully", email: user.email });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create admin user" });
  }
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }
  try {
    const [user] = await db
      .select()
      .from(adminUsersTable)
      .where(eq(adminUsersTable.email, String(email).toLowerCase().trim()))
      .limit(1);

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const valid = await bcrypt.compare(String(password), user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = signToken({ id: user.id, email: user.email });
    res.json({ token, email: user.email });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/auth/health", async (req, res) => {
  try {
    const [existingUser] = await db
      .select()
      .from(adminUsersTable)
      .limit(1);

    res.json({ adminUserExists: !!existingUser });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to check admin user status" });
  }
});

router.get("/auth/me", requireAuth, (req: AuthRequest, res) => {
  res.json({ email: req.adminUser!.email });
});

export default router;
