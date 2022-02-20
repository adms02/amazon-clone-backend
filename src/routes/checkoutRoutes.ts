import { Router } from "express";
import { isAuth } from "../middleware/isAuth";
import errorCatcher from "../middleware/utils/errorCatcher";
import * as checkoutController from "../controllers/checkoutController";

const router = Router();

router.post("/create-checkout-session", errorCatcher(isAuth), errorCatcher(checkoutController.createCheckoutSession));

export { router as checkoutRoutes };
