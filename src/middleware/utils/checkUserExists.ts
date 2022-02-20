import { CustomerModel } from "../../db/models/customerModel";
import { AppError } from "./error_handler";

export const checkUserExists = async (email: string) => {
  const emailExists = await CustomerModel.query().count("*").where("email", "=", email);

  if (emailExists.length > 0) {
    throw new AppError(409, "Email already exists");
  }
};
