import { Router } from "express";
import * as authController from "../controllers/authController";
import errorCatcher from "../middleware/utils/errorCatcher";

const router = Router();

router.put("/signup", errorCatcher(authController.signup));

router.post("/signin", errorCatcher(authController.signin));

router.post("/requestpasswordreset", errorCatcher(authController.requestPasswordReset));

router.post("/checkresetpasstokenvalid", errorCatcher(authController.checkResetPassTokenValid));

router.post("/setnewpassword", errorCatcher(authController.setNewPassword));

export { router as authRouter };
