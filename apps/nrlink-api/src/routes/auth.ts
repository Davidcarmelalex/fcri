import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

export const authRouter = Router();

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12),
  organizationName: z.string().min(2),
  role: z.enum(["operator", "institution", "admin"]).default("operator"),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

authRouter.post("/register", async (req, res, next) => {
  try {
    const body = RegisterSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const passwordHash = await bcrypt.hash(body.password, 12);
    const user = await prisma.user.create({
      data: { email: body.email, passwordHash, organizationName: body.organizationName, role: body.role },
      select: { id: true, email: true, organizationName: true, role: true, createdAt: true },
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "7d" });
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const body = LoginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(body.password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "7d" });
    res.json({
      user: { id: user.id, email: user.email, organizationName: user.organizationName, role: user.role },
      token,
    });
  } catch (err) {
    next(err);
  }
});

authRouter.get("/me", async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
    const token = authHeader.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, organizationName: true, role: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    next(err);
  }
});
