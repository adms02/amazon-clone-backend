import * as productService from "../services/productService";
import { RequestHandler } from "express";

/**
 * //*Return all products
 */

export const getAllProducts: RequestHandler = async (req, res, next) => {
  const products = await productService.getAllProducts();

  res.status(200).json({
    products,
  });
};

/**
 * //*Return product info by id
 */

export const getProduct: RequestHandler = async (req, res, next) => {
  const { productId } = req.body;

  const product = await productService.getProduct(productId);

  res.status(200).json({
    product,
  });
};
