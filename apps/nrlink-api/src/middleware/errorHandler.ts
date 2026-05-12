import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation error",
      details: err.errors.map((e) => ({ path: e.path.join("."), message: e.message })),
    });
  }

  const status = (err as any).status || 500;
  const message = status === 500 ? "Internal server error" : err.message;

  if (status === 500) {
    console.error("[ERROR]", err);
  }

  res.status(status).json({ error: message });
}
