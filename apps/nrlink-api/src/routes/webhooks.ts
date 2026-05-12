import { Router } from "express";
import { prisma } from "../lib/prisma.js";

export const webhooksRouter = Router();

webhooksRouter.post("/settlement", async (req, res, next) => {
  try {
    const signature = req.headers["x-webhook-signature"];
    const expectedSig = process.env.WEBHOOK_SECRET;

    if (!signature || signature !== expectedSig) {
      return res.status(401).json({ error: "Invalid webhook signature" });
    }

    const event = req.body;
    await prisma.webhookEvent.create({
      data: { eventType: event.type, payload: event, processed: false },
    });

    if (event.type === "settlement.completed" && event.transactionId) {
      await prisma.transaction.update({
        where: { id: event.transactionId },
        data: { status: "settled", settledAt: new Date() },
      });
    }

    if (event.type === "compliance.approved" && event.transactionId) {
      await prisma.transaction.update({
        where: { id: event.transactionId },
        data: { complianceCheck: "approved", status: "processing" },
      });
    }

    res.json({ received: true });
  } catch (err) {
    next(err);
  }
});
