import { Router } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/authenticate.js";
import { prisma } from "../lib/prisma.js";

export const transactionsRouter = Router();

const CreateTransactionSchema = z.object({
  quoteId: z.string().uuid(),
  beneficiaryId: z.string().uuid(),
});

transactionsRouter.post("/", authenticate, async (req, res, next) => {
  try {
    const body = CreateTransactionSchema.parse(req.body);
    const userId = (req as any).userId;

    const quote = await prisma.quote.findFirst({
      where: { id: body.quoteId, userId, status: "active" },
    });
    if (!quote) return res.status(400).json({ error: "Quote not found or expired" });
    if (quote.expiresAt < new Date()) {
      await prisma.quote.update({ where: { id: quote.id }, data: { status: "expired" } });
      return res.status(400).json({ error: "Quote has expired. Please request a new quote." });
    }

    const beneficiary = await prisma.beneficiary.findFirst({
      where: { id: body.beneficiaryId, userId },
    });
    if (!beneficiary) return res.status(404).json({ error: "Beneficiary not found" });

    const [transaction] = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          userId,
          quoteId: quote.id,
          beneficiaryId: beneficiary.id,
          sourceCurrency: quote.sourceCurrency,
          targetCurrency: quote.targetCurrency,
          sourceAmount: quote.sourceAmount,
          targetAmount: quote.targetAmount,
          fee: quote.fee,
          status: "pending",
          complianceCheck: "pending",
        },
        include: { beneficiary: true, quote: true },
      }),
      prisma.quote.update({ where: { id: quote.id }, data: { status: "used" } }),
    ]);

    res.status(201).json({ transaction });
  } catch (err) {
    next(err);
  }
});

transactionsRouter.get("/", authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

    const [transactions, total] = await prisma.$transaction([
      prisma.transaction.findMany({
        where: { userId },
        include: { beneficiary: { select: { name: true, country: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.transaction.count({ where: { userId } }),
    ]);

    res.json({ transactions, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

transactionsRouter.get("/:id", authenticate, async (req, res, next) => {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: { id: req.params.id, userId: (req as any).userId },
      include: { beneficiary: true, quote: true },
    });
    if (!transaction) return res.status(404).json({ error: "Transaction not found" });
    res.json({ transaction });
  } catch (err) {
    next(err);
  }
});
