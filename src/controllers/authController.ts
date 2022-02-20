import { RequestHandler } from "express";
import * as authService from "../services/authService";
import { AppError } from "../middleware/utils/error_handler";

/**
 *  //*Signup customer and if successful sign the user in
 */

export const signup: RequestHandler = async (req, res, next) => {
  const { name, email, password } = req.body;

  await authService.signup(name, email, password);

  const { token, user } = await authService.signin(email, password);

  res.status(200).json({
    token,
    user,
  });
};

/**
 * //*Sign customer into account
 */

export const signin: RequestHandler = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const { token, user } = await authService.signin(email, password);

  res.status(200).json({
    token,
    user,
  });
};

export const requestPasswordReset: RequestHandler = async (req, res, next) => {
  const email = req.body.email;

  await authService.requestPasswordReset(email);

  res.status(200).json({
    message: `A reset email has been sent to ${email}.`,
  });
};

/**
 * Checks if reset pass token is valid
 */

export const checkResetPassTokenValid: RequestHandler = async (req, res, next) => {
  const { token } = req.body;

  if (token === undefined) {
    throw new AppError(401, "Invalid token");
  }

  await authService.checkResetPassTokenValid(token);

  res.status(200).json({
    Message: "Token valid",
  });
};

/**
 * Set new password
 */

export const setNewPassword: RequestHandler = async (req, res, next) => {
  const newPassword = req.body.password;
  const token = req.body.token;

  const customerId = await authService.checkResetPassTokenValid(token);

  await authService.setNewPassword(newPassword, customerId);

  res.status(200).json({
    Message: "Password has been reset",
  });
};
