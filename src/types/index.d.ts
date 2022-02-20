import CustomerModel from "../db/models/customerModel";

declare global {
  declare namespace Express {
    export interface Request {
      currentCustomer?: import("./customer").Customer;
    }
  }

  declare module "jsonwebtoken" {
    export interface JwtPayloadWithId extends jwt.JwtPayload {
      id: string;
    }
  }
}
