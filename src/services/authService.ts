import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { CustomerModel } from "../db/models/customerModel";
import sgMail from "@sendgrid/mail";
import { LOGIN_PRIVATE_KEY, SENDGRID_API_KEY } from "../config";
import { ResetPasswordModel } from "../db/models/resetpasswordModel";
import jwt from "jsonwebtoken";
sgMail.setApiKey(SENDGRID_API_KEY);
import { AppError } from "../middleware/utils/error_handler";

/**
 * //*Sign up Service
 */

export const signup = async (name: string, email: string, password: string) => {
  if (await CustomerModel.checkCustomerExists(email)) {
    throw new AppError(409, "Email already exists");
  }

  const hashedPw = await CustomerModel.hashPw(password);

  const firstname = name.split(" ")[0];
  const lastname = name.split(" ")[1];

  console.log(firstname);
  console.log(lastname);

  await CustomerModel.query().insert({
    id: uuidv4(),
    firstname: firstname,
    lastname: lastname || " ",
    email: email,
    password: hashedPw,
  });
};

/**
 * //* Sign in Service
 */

export const signin = async (email: string, password: string) => {
  const loadedUser = await CustomerModel.getCustomer(email);

  if (loadedUser === undefined) {
    throw new AppError(404, "We cannot find an account with that e-mail address");
  }

  const isMatch = await bcrypt.compare(password, loadedUser.password!);

  if (!isMatch) {
    throw new AppError(401, "Wrong password");
  }

  const token = await jwt.sign(
    {
      email: loadedUser.email!,
      id: loadedUser.id!,
    },
    LOGIN_PRIVATE_KEY,
    { expiresIn: "1h" }
  );

  const user = { ...loadedUser };
  delete user.password;

  return { token, user };
};

/**
 * //*Request password service
 */

export const requestPasswordReset = async (email: string) => {
  const loadedUser = await CustomerModel.query().select("*").where("email", "=", email);

  if (!loadedUser[0] || loadedUser[0].id === undefined) {
    throw new AppError(403, "We're sorry. We weren't able to identify you given the information provided.");
  }

  const token = await jwt.sign(
    {
      id: loadedUser[0].id,
    },
    LOGIN_PRIVATE_KEY,
    { expiresIn: "15h" }
  );

  //Create reset token

  await ResetPasswordModel.createResetToken(loadedUser[0].id, token);

  const link = process.env.CLIENT + "/ap/resetpassword/" + token;

  const msg = {
    to: email,
    dynamic_template_data: {
      activation_link: link,
    },
    from: process.env.EMAIL,
    templateId: process.env.SENDGRID_RESETPASSWORD_TEMPLATEID,
  };

  //@ts-ignore
  await sgMail.send(msg);
};

/**
 * //*Check if resetpass token is valid
 */

export const checkResetPassTokenValid = async (token: string) => {
  const decodedToken = jwt.verify(token, LOGIN_PRIVATE_KEY);

  if (decodedToken === undefined) {
    throw new AppError(401, "Invalid token");
  }

  if (typeof decodedToken === "object") {
    const foundUser = await ResetPasswordModel.query().findById(decodedToken.id);
    if (foundUser === undefined || foundUser.resetpasstoken !== token) {
      throw new AppError(401, "Invalid token");
    }

    if ("id" in decodedToken) {
      return decodedToken.id;
    }
  }
};

/**
 * //*Set new password
 */

export const setNewPassword = async (newPassword: string, customerId: string) => {
  const hashedPw = await bcrypt.hash(newPassword, 12);

  await CustomerModel.query().findById(customerId).patch({
    password: hashedPw,
  });

  await ResetPasswordModel.query().deleteById(customerId);
};
