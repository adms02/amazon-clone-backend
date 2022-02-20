import { TypeFromModel } from "./type-from-model";
import { CustomerModel } from "../db/models/customerModel";

export type Customer = TypeFromModel<CustomerModel>;
