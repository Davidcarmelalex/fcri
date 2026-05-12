import { Router } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/authenticate.js";
import { prisma } from "../lib/prisma.js";

export const beneficiariesRouter = Router();

const CreateBeneficiarySchema = z.object({
  name: z.string().min(2),
  country: z.string().length(2),
  currency: z.string().length(3),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  iban: z.string().optional(),
  swift: z.string().optional(),
});

beneficiariesRouter.get("/", authenticate, async (req, res, next) => {
  try {
    const beneficiaries = await prisma.beneficiary.findMany({
      where: { userId: (req as any).userId },
      orderBy: { createdAt: "desc" },
    });
    res.json({ beneficiaries });
  } catch (err) { next(err); }
});

beneficiariesRouter.post("/", authenticate, async (req, res, next) => {
  try {
    const body = CreateBeneficiarySchema.parse(req.body);
    const beneficiary = await prisma.beneficiary.create({
      data: { ...body, userId: (req as any).userId },
    });
    res.status(201).json({ beneficiary });
  } catch (err) { next(err); }
});

beneficiariesRouter.delete("/:id", authenticate, async (req, res, next) => {
  try {
    const existing = await prisma.beneficiary.findFirst({
      where: { id: req.params.id, userId: (req as any).userId },
    });
    if (!existing) return res.status(404).json({ error: "Beneficiary not found" });
    await prisma.beneficiary.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) { next(err); }
});
