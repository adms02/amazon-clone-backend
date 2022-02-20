import express, { NextFunction, Request, Response, ErrorRequestHandler, Router } from "express";
import { authRouter } from "./routes/authRoutes";
import { productRouter } from "./routes/productRoutes";
import { profileRouter } from "./routes/profileRoutes";
import { checkoutRoutes } from "./routes/checkoutRoutes";
import { webhookRoutes } from "./routes/webhookRoutes";
import { setupDb, testConnection } from "./db/db";
import cors from "cors";
import { AppError } from "./middleware/utils/error_handler";

setupDb();

(async () => {
  await testConnection().catch((err) => {
    console.error("Database setup failure:\n", err);
    process.exit(1);
  });
})();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Use JSON parser for all non-webhook routes
app.use((req: Request, res: Response, next: NextFunction): void => {
  console.log(`url: ${req.originalUrl}`);
  if (req.originalUrl === "/webhooks/stripe") {
    console.log("hit webhooks url");
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/checkout", checkoutRoutes);
app.use("/webhooks", webhookRoutes);

app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500 }: AppError = err as AppError;

  res.status(statusCode).send({
    error: err.message,
  });
});

export { app };
