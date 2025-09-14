import { NextFunction, Request, Response } from "express";
import { routesOptions } from "./auth.routes";
type SupabaseAuthError = {
  message?: string;
  status?: number;
  code?: string;
};

/**
 * Maps Supabase error codes/messages to user-friendly messages.
 */
const mapAuthErrorMessage = (err: SupabaseAuthError): string => {
  const raw = err.message?.toLowerCase() ?? "";

  if (
    raw.includes("unauthorized") ||
    raw.includes("invalid login credentials")
  ) {
    return "Invalid email or password. Please try again.";
  }

  if (raw.includes("user not found")) {
    return "No account found with this email.";
  }

  if (raw.includes("User already registered")) {
    return "This user is already registered. Try logging in instead.";
  }

  if (
    raw.includes("email already registered") ||
    raw.includes("email already exists")
  ) {
    return "This email is already registered. Try logging in instead.";
  }

  if (raw.includes("invalid email")) {
    return "Please enter a valid email address.";
  }

  if (raw.includes("password too short")) {
    return "Password must be at least 6 characters long.";
  }

  if (raw.includes("too many requests")) {
    return "Too many login attempts. Please wait a moment and try again.";
  }

  return err.message || "Something went wrong. Please try again.";
};

const createAuthErrorHandler =
  (context?: routesOptions) =>
  (
    err: Error & SupabaseAuthError,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const message = mapAuthErrorMessage(err);

    if (process.env.NODE_ENV === "development") {
      console.error("❌ Auth error:", err);
    }

    res
      .status(err.status ?? 401)
      .header("Content-Type", "application/json; charset=utf-8")
      .json({
        success: false,
        message,
        ...(context && { context }),
      });
  };

export default createAuthErrorHandler;
