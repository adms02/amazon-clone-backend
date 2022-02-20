import { RequestHandler } from "express";
import * as profileService from "../services/profileService";
import { paginateResult } from "../middleware/utils/paginateResult";

/**
 * getCustomer Info Controller
 */

export const getCustomerInfo: RequestHandler = async (req, res, next) => {
  res.status(200).json({
    user: req.currentCustomer,
  });
};

/**
 * getAllOrders Controller
 */

export const getOrders: RequestHandler = async (req, res, next) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  const customerId = req.currentCustomer?.id!;
  const combinedItems = await profileService.getAllOrders(customerId);

  const results = paginateResult(combinedItems, page, limit);

  res.status(200).json(results);
};

/**
 * updateCustomer Name Controller
 */

export const updateCustomerName: RequestHandler = async (req, res, next) => {
  const customerName: string = req.body.name;
  const customerId: string = req?.currentCustomer?.id!;

  await profileService.updateCustomerName(customerId, customerName);

  res.status(200).json();
};

/**
 * update Customer Email controller
 */

export const updateCustomerEmail: RequestHandler = async (req, res, next) => {
  const email = req.body.email;
  const customerId: string = req?.currentCustomer?.id!;

  await profileService.updateCustomerEmail(customerId, email);

  res.status(200).json();
};
