// import schema to validate request body

import { signinSchema, signupSchema } from "../../libs/schemas/schema.auth";

export const loginSchema = signinSchema;
export const registrationSchema = signupSchema;
