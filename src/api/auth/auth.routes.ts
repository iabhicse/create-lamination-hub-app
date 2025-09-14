import { Router } from "express";
import * as authControllers from "./auth.controllers";
import createAuthErrorHandler from "./auth.error";

const authRoutes: ReturnType<typeof Router> = Router();

//all api routes for auth services
authRoutes.post(
  "/login",
  authControllers.loginAuthController,
  createAuthErrorHandler("signin")
);
authRoutes.post(
  "/logout",
  authControllers.logoutAuthController,
  createAuthErrorHandler("signout")
);
authRoutes.post(
  "/register",
  authControllers.registerAuthController,
  createAuthErrorHandler("signup")
);
authRoutes.post(
  "/verify-email",
  authControllers.verifyEmailAuthController,
  createAuthErrorHandler("verifyEmail")
);
authRoutes.post(
  "/reset-password",
  authControllers.resetPasswordAuthController,
  createAuthErrorHandler("resetPassword")
);
authRoutes.post(
  "/forgot-password",
  authControllers.forgotPasswordAuthController,
  createAuthErrorHandler("forgotPassword")
);

export default authRoutes;

export type routesOptions =
  | "signup"
  | "signin"
  | "signout"
  | "profile"
  | "refreshToken"
  | "verifyEmail"
  | "resetPassword"
  | "forgotPassword";
