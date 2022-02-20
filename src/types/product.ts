import { ProductModel } from "../db/models/productModel";
import { TypeFromModel } from "./type-from-model";

export type Product = TypeFromModel<ProductModel>;
