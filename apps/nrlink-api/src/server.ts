import express from "express";
import cors from "cors";
import helmet from "helmet";
import { authRouter } from "./routes/auth.js";
import { quotesRouter } from "./routes/quotes.js";
import { transactionsRouter } from "./routes/transactions.js";
import { beneficiariesRouter } from "./routes/beneficiaries.js";
import { webhooksRouter } from "./routes/webhooks.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/logger.js";
import { rateLimiter } from "./middleware/rateLimiter.js";

const app = express();
const PORT = process.env.PORT || 4100;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3100" }));
app.use(express.json());
app.use(requestLogger);
app.use(rateLimiter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "nrlink-api", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRouter);
app.use("/api/quotes", quotesRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/beneficiaries", beneficiariesRouter);
app.use("/api/webhooks", webhooksRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`NRLink API running on port ${PORT}`);
});

export default app;
