import { Router } from "express";
import createAuthErrorHandler from "./auth.error";
import * as authControllers from "./auth.controllers";

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
authRoutes.post(
  "/profile",
  authControllers.profileAuthController,
  createAuthErrorHandler("profile")
);

authRoutes.post(
  "/refresh",
  authControllers.refreshTokenAuthController,
  createAuthErrorHandler("refreshToken")
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
