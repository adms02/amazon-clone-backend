import { Router } from "express";
import { isAuth } from "../middleware/isAuth";
import errorCatcher from "../middleware/utils/errorCatcher";
import * as profileController from "../controllers/profileController";

const router = Router();

router.get("/user", errorCatcher(isAuth), errorCatcher(profileController.getCustomerInfo));

router.get("/orders", errorCatcher(isAuth), errorCatcher(profileController.getOrders));

router.put("/user/name", errorCatcher(isAuth), errorCatcher(profileController.updateCustomerName));

router.put("/user/email", errorCatcher(isAuth), errorCatcher(profileController.updateCustomerEmail));

export { router as profileRouter };
