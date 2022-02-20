import Yup from "yup";

export const signupSchema = Yup.object({
  firstname: Yup.string().required().min(2, "Too short").max(20, "Too long"),
  lastname: Yup.string().required().min(2, "Too short").max(20, "Too long"),
  email: Yup.string().email().required(),
  password: Yup.string().min(4, "Enter a longer password").max(40, "Enter a shorter password").required(),
});

type SignupType = Yup.InferType<typeof signupSchema>;
