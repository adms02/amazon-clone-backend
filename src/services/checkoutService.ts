import { v4 as uuidv4 } from "uuid";
import { ProductModel } from "../db/models/productModel";
import { OrderModel } from "../db/models/orderModel";
import { Orders_has_productModel } from "../db/models/orders_has_productModel";
import Stripe from "stripe";
import { AppError } from "../middleware/utils/error_handler";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2020-08-27",
});

interface Items {
  id: string;
  quantity: number;
}

export const validateQuantity = async (items: Items[]) => {
  for (const [k, v] of Object.entries(items)) {
    const desiredQuantity = v.quantity;
    const availableQuantity = await ProductModel.getQuantityById(v.id);

    if (desiredQuantity > availableQuantity) {
      throw new AppError(404, "Product out of stock");
    }
  }

  return true;
};

export const createValidCheckoutItems = async (items: Items[]) => {
  const verifiedBasketItems = [];

  for (const [k, v] of Object.entries(items)) {
    const item = await ProductModel.getById(v.id, ["id", "title", "price", "images"]);

    verifiedBasketItems.push({
      quantity: v.quantity,
      price_data: {
        unit_amount_decimal: Number(String(item.price).replace(".", "")),
        currency: "gbp",
        product_data: {
          name: item.title?.replace(/^(.{30}[^\s]*).*/, "$1") + "...",
          // @ts-ignore
          images: [item.images.id1],
          metadata: {
            product_id: v.id,
          },
        },
      },
    });
  }

  return verifiedBasketItems;
};

/**
 * //*Executes when proceeed to checkout button clicked
 */

export const createStripeSession = async (
  customerId: string,
  email: string,
  verifiedBasketItems: object
): Promise<Stripe.Checkout.Session> => {
  const session = await stripe.checkout.sessions.create({
    client_reference_id: customerId,
    customer_email: email,
    payment_method_types: ["card"],
    shipping_rates: ["shr_1JPESLGSUK7OOgg2UrRhewpb"],
    shipping_address_collection: {
      allowed_countries: ["GB", "US"],
    },
    // @ts-ignore
    line_items: verifiedBasketItems,
    mode: "payment",
    success_url: `${process.env.FRONTEND}/gp/buy/thankyou`,
    cancel_url: `${process.env.FRONTEND}/basket`,
  });

  console.log(session);

  return session;
};

/**
 * //*Runs if payment successful
 */

export const checkIfSuccessful = async (requestBody: any, sig: string | string[] | Buffer) => {
  const event = stripe.webhooks.constructEvent(requestBody, sig, process.env.STRIPE_SIGNING_SECRET!);

  if (event.type === "checkout.session.completed") {
    console.log("checkout sess completed ran");
    const session = event.data.object as any;

    const { line_items } = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items.data.price.product"],
    });

    await addOrderToDB(session, line_items);
  }
};

/**
 * //*Adds order to DB
 */

export const addOrderToDB = async (session: any, line_items: any) => {
  const orderId = uuidv4();

  await OrderModel.query().insert({
    id: orderId,
    customer_id: session.client_reference_id,
    payment_id: session.id,
    paid: true,
    created_at: new Date(),
    amount_shipping: session.total_details.amount_shipping / 100,
    amount_total: session.amount_total / 100,
  });

  for (let val of Object.values(line_items.data)) {
    await Orders_has_productModel.query().insert({
      order_id: orderId,
      //@ts-ignore
      product_id: val.price.product.metadata.product_id,
      //@ts-ignore
      quantity: val.quantity,
    });
  }
};
