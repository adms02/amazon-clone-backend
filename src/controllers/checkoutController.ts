import { RequestHandler } from "express";
import * as checkoutService from "../services/checkoutService";

export const createCheckoutSession: RequestHandler = async (req, res, next) => {
  const email = req.currentCustomer?.email;
  const customerId = req.currentCustomer?.id;
  const items = req.body.line_items;

  await checkoutService.validateQuantity(items);

  const verifiedBasketItems = await checkoutService.createValidCheckoutItems(items);

  const session = await checkoutService.createStripeSession(customerId!, email!, verifiedBasketItems);

  res.status(200).json({
    id: session.id,
  });
};

export const stripeWebhook: RequestHandler = async (req, res, next) => {
  console.log("webhook ran");
  const sig = req.headers["stripe-signature"];
  const requestBody = req.body;

  //@ts-ignore
  await checkoutService.checkIfSuccessful(requestBody, sig);

  res.status(200).json({ received: true });
};
