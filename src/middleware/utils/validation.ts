import { Request, Response, NextFunction } from "express";
import Yup from "yup";
import errorCatcher from "./errorCatcher";

export const validation = (schema: Yup.AnySchema) => {
  return errorCatcher(async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;

    try {
      await schema.validate(body);
      next();
    } catch (err) {
      return res.status(400).json(err);
    }
  });
};
