import dotenv from "dotenv";

dotenv.config();

export const LOGIN_PRIVATE_KEY: string = process.env.LOGIN_PRIVATE_KEY!;
export const SENDGRID_API_KEY: string = process.env.SENDGRID_API_KEY!;
