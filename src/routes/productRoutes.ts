import { Router } from "express";
import * as productController from "../controllers/productController";
import errorCatcher from "../middleware/utils/errorCatcher";

const router = Router();

router.get("/getallproducts", errorCatcher(productController.getAllProducts));

router.post("/getproduct", errorCatcher(productController.getProduct));

export { router as productRouter };
