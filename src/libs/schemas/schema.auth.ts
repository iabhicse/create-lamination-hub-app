import z from "zod";
import {
  emailRules,
  fullnameRules,
  passwordRules,
  termsAcceptedRules,
} from "../configs/config.schema";

export const signupSchema = z
  .object({
    fullname: fullnameRules,
    email: emailRules,
    password: passwordRules,
    terms: termsAcceptedRules,
  })
  .describe("Registration form");

export const signinSchema = z.object({
  email: emailRules,
  password: passwordRules,
  remember: z.boolean().optional(),
});

export const forgetPasswordSchema = z.object({
  email: emailRules,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: passwordRules,
  confirmPassword: passwordRules,
});

export const updatePasswordSchema = z.object({
  password: passwordRules,
  confirmPassword: passwordRules,
});

export const updateProfileSchema = z.object({
  fullname: fullnameRules,
  email: emailRules,
});

export const contactSchema = z.object({
  fullname: fullnameRules,
  email: emailRules,
  topic: z.string().trim().min(5, "Topic is required"),
  message: z.string().trim().min(5, "Message is required"),
  newsletter: z.boolean().optional(),
});
