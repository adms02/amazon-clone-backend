import jwt from "jsonwebtoken";
import { CustomerModel } from "../db/models/customerModel";
import { RequestHandler } from "express";
import { LOGIN_PRIVATE_KEY } from "../config";
import { AppError } from "./utils/error_handler";

/**
 * //*Checks if client token valid. If token not valid throw error.
 */

export const isAuth: RequestHandler = async (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    throw new AppError(401, "Invalid token");
  }

  const token = authHeader.split(" ")[1];

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, LOGIN_PRIVATE_KEY);
  } catch (err) {
    throw new AppError(401, "Invalid token");
  }

  if (decodedToken === undefined) {
    throw new AppError(401, "Invalid token");
  }

  /**
   * Attatches Handy Customer info to req so we don't need to make
   * another call later
   */

  if (typeof decodedToken === "object") {
    const customer = await CustomerModel.query().findById(decodedToken.id);

    req.currentCustomer = customer;
    delete req.currentCustomer.password;
  }

  next();
};
