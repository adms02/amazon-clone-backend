import { ProductModel } from "../db/models/productModel";
import { AppError } from "../middleware/utils/error_handler";

/**
 * //*Return all products
 */

export const getAllProducts = async (): Promise<ProductModel[]> => {
  const products = await ProductModel.query().select("product.id", "product.title", "product.price", "images", "rating");

  if (products.length === 0) throw new AppError(404, "No products");

  return products;
};

/**
 * //*Return product by id
 */

export const getProduct = async (productId: string): Promise<ProductModel> => {
  const products = await ProductModel.query().select().where("product.id", "=", productId).limit(1);

  if (products.length === 0) {
    throw new AppError(404, `Product with id '${productId}' not found.`);
  }

  return products[0];
};
