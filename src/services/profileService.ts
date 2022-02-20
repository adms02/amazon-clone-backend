import { ProductModel } from "../db/models/productModel";
import { OrderModel } from "../db/models/orderModel";
import { Orders_has_productModel } from "../db/models/orders_has_productModel";
import { Product } from "../types/product";
import { TypeFromModel } from "../types/type-from-model";
import { CustomerModel } from "../db/models/customerModel";
import { AppError } from "../middleware/utils/error_handler";

type Order = TypeFromModel<OrderModel>;
type MergedOrder = Product & Order;

export const getAllOrders = async (customerId: string) => {
  const rawResult = (await OrderModel.query()
    .select(
      "payment_id",
      "created_at",
      "amount_shipping",
      "amount_total",
      "orders_has_product.product_id",
      "orders_has_product.quantity",
      "product.title",
      "product.images"
    )
    .join("orders_has_product", "order_id", "=", "order.id")
    .join("product", "product.id", "=", "orders_has_product.product_id")
    .where("order.customer_id", "=", customerId)
    .orderBy("created_at", "desc")) as MergedOrder[];

  const combinedItems = rawResult.reduce((acc, curr) => {
    const firstIndex = acc.findIndex((x: any) => x.payment_id === curr.payment_id);

    const { payment_id, created_at, amount_shipping, amount_total, product_id, quantity, title, images } = curr;

    if (firstIndex === -1) {
      acc.push({
        payment_id,
        created_at,
        amount_shipping,
        amount_total,
        products: [
          {
            product_id,
            quantity,
            title,
            //@ts-ignore
            images,
          },
        ],
      });
    } else {
      if (acc[firstIndex] !== -1) {
        acc[firstIndex].products?.push({
          product_id,
          quantity,
          title,
          //@ts-ignore
          images,
        });
      }
    }

    return acc;
  }, [] as MergedOrder[]);

  return combinedItems;
};

export const updateCustomerName = async (customerId: string, customerName: string) => {
  const arr = customerName.split(" ");
  const firstName = arr[0];
  let lastName = "";

  if (arr.length > 1) {
    lastName = arr[1];
  }

  await CustomerModel.query().findById(customerId).patch({
    firstname: firstName,
    lastname: lastName,
  });
};

export const updateCustomerEmail = async (customerId: string, email: string) => {
  if (await CustomerModel.checkCustomerExists(email)) {
    throw new AppError(409, "Email already exists");
  }

  await CustomerModel.query().findById(customerId).patch({
    email: email,
  });
};
