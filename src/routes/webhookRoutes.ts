import { Router } from "express";
import errorCatcher from "../middleware/utils/errorCatcher";
import * as checkoutController from "../controllers/checkoutController";
import express from "express";

const router = Router();

router.post("/stripe", express.raw({ type: "application/json" }), errorCatcher(checkoutController.stripeWebhook));

export { router as webhookRoutes };
