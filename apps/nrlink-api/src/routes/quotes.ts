import { Router } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/authenticate.js";
import { prisma } from "../lib/prisma.js";

export const quotesRouter = Router();

const QuoteRequestSchema = z.object({
  sourceCurrency: z.string().length(3),
  targetCurrency: z.string().length(3),
  sourceAmount: z.number().positive(),
  beneficiaryId: z.string().uuid().optional(),
});

// Mock FX engine — replace with real liquidity provider
async function getExchangeRate(from: string, to: string): Promise<number> {
  const mockRates: Record<string, number> = {
    "USD_EUR": 0.92, "USD_GBP": 0.79, "USD_AED": 3.67,
    "EUR_USD": 1.09, "EUR_GBP": 0.86, "GBP_USD": 1.27,
  };
  return mockRates[`${from}_${to}`] || 1.0;
}

quotesRouter.post("/", authenticate, async (req, res, next) => {
  try {
    const body = QuoteRequestSchema.parse(req.body);
    const rate = await getExchangeRate(body.sourceCurrency, body.targetCurrency);
    const fee = body.sourceAmount * 0.0025; // 0.25% fee
    const targetAmount = (body.sourceAmount - fee) * rate;
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min validity

    const quote = await prisma.quote.create({
      data: {
        userId: (req as any).userId,
        sourceCurrency: body.sourceCurrency,
        targetCurrency: body.targetCurrency,
        sourceAmount: body.sourceAmount,
        targetAmount,
        exchangeRate: rate,
        fee,
        expiresAt,
        status: "active",
      },
    });

    res.json({ quote });
  } catch (err) {
    next(err);
  }
});

quotesRouter.get("/:id", authenticate, async (req, res, next) => {
  try {
    const quote = await prisma.quote.findFirst({
      where: { id: req.params.id, userId: (req as any).userId },
    });
    if (!quote) return res.status(404).json({ error: "Quote not found" });
    res.json({ quote });
  } catch (err) {
    next(err);
  }
});
