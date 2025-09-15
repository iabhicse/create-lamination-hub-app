import { supabase } from "../../libs/db/db.supabase";
import { CookieOptions, Request, Response } from "express";
import { AuthError, Session, User } from "@supabase/supabase-js";
import { loginSchema, registrationSchema } from "./auth.schemas";
import { IUserProfileRoleType, IUserSignin } from "../../types/users";

import {
  forgetUserPassword,
  getUserByToken,
  getUserProfile,
  refreshTokenUser,
  registerUser,
  resetUserPassword,
  signinUser,
  signoutUser,
  verifyUserEmail,
} from "./auth.helper";
import {
  getCookieExpiryInDays,
  getCookieExpiryInMinutes,
} from "../../libs/utils/utils.app";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
};

//login controller
export const loginAuthController = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      if (process.env.NODE_ENV === "development") {
        console.error("[Validation Error]", parsed.error.issues); // Avoid .format()
      }

      return res.status(400).json({
        status: "failed",
        message: "Invalid input",
        errors: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
          code: issue.code,
        })),
      });
    }

    const { email, password, remember } = req.body as IUserSignin;
    const result = await signinUser({ email, password });
    const { user, session } = result.data as { user: User; session: Session };

    if (!session?.access_token || !session?.refresh_token) {
      return res.status(500).json({
        status: "error",
        message: "Token generation failed",
        data: null,
      });
    }

    const userDatafromDB = await getUserProfile(email);

    const accessTokenExpiresIn = remember
      ? getCookieExpiryInDays(1)
      : getCookieExpiryInMinutes(15);

    res.cookie("accesstoken", session.access_token, {
      ...cookieOptions,
      maxAge: accessTokenExpiresIn,
    });
    res.cookie("refreshtoken", session.refresh_token, {
      ...cookieOptions,
      maxAge: remember ? getCookieExpiryInDays(30) : getCookieExpiryInDays(7),
    });

    const currentUser = {
      id: userDatafromDB?.id,
      email,
      role: (userDatafromDB?.role ?? "USER") as IUserProfileRoleType,
      fullname: userDatafromDB?.fullname ?? "",
      avatar: userDatafromDB?.avatar ?? null,
      created_at: user.created_at,
      updated_at: user.updated_at,
      isUserVerified: user.user_metadata?.isUserVerified ?? false,
    };

    return res.status(200).json({
      success: true,
      message: "User signed in successfully.",
      tokenExpiresIn: accessTokenExpiresIn,
      data: currentUser,
    });
  } catch (err: unknown) {
    const fallback = err as AuthError;
    throw {
      status: fallback?.status || 500,
      message: fallback?.message || "Unexpected error during login.",
    };
  }
};

//logout controller
export const logoutAuthController = async (req: Request, res: Response) => {
  try {
    const result = await signoutUser();

    return res.status(200).json({
      status: "success",
      message: "Logout successful",
      data: result,
    });
  } catch (err: unknown) {
    const fallback = err as AuthError;
    throw {
      status: fallback?.status || 500,
      message: fallback?.message || "Unexpected error during logout.",
    };
  }
};

//register controller
export const registerAuthController = async (req: Request, res: Response) => {
  try {
    const parsed = registrationSchema.safeParse(req.body);

    if (!parsed.success) {
      if (process.env.NODE_ENV === "development") {
        console.error("[Validation Error]", parsed.error.issues); // Avoid .format()
      }

      return res.status(400).json({
        status: "failed",
        message: "Invalid input",
        errors: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
          code: issue.code,
        })),
      });
    }

    const { email, fullname } = parsed.data;

    const result = await registerUser(parsed.data);

    const { user } = result.data as { user: User };

    //new user information to be stored on database
    const newUser = {
      user_id: user.id,
      email: email,
      fullname: fullname,
      role: "USER" as IUserProfileRoleType,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    const { error: insertError } = await supabase
      .from("iLocalUsers")
      .insert([newUser])
      .single();

    if (insertError) {
      throw insertError;
    }

    return res.status(201).json({
      status: "success",
      message: "Registration successful",
      data: newUser,
    });
  } catch (err: unknown) {
    const fallback = err as AuthError;
    throw {
      status: fallback?.status || 500,
      message: fallback?.message || "Unexpected error during registeration.",
    };
  }
};

export const verifyEmailAuthController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await verifyUserEmail();

    return res.status(200).json({
      success: true,
      message: "Email verification successful",
      data: result,
    });
  } catch (err: unknown) {
    const fallback = err as AuthError;
    throw {
      status: fallback?.status || 500,
      message:
        fallback?.message || "Unexpected error during email verification.",
    };
  }
};

export const resetPasswordAuthController = async (
  req: Request,
  res: Response
) => {
  try {
    const { newPassword } = req.body as { newPassword: string };

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
        data: null,
      });
    }

    const result = await resetUserPassword(newPassword);

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
      data: result,
    });
  } catch (err: unknown) {
    const fallback = err as AuthError;
    throw {
      status: fallback?.status || 500,
      message: fallback?.message || "Unexpected error during password reset.",
    };
  }
};

export const forgotPasswordAuthController = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body as { email: string };

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
        data: null,
      });
    }

    const result = await forgetUserPassword(email);

    return res.status(200).json({
      success: true,
      message: "Password recovery email sent",
      data: result,
    });
  } catch (err: unknown) {
    const fallback = err as AuthError;
    throw {
      status: fallback?.status || 500,
      message:
        fallback?.message || "Unexpected error during password recovery.",
    };
  }
};

export const profileAuthController = async (req: Request, res: Response) => {
  try {

    const token = req.cookies.accesstoken as string;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized", data: null });
    }

    const user = await getUserByToken(token);

    const { email } = user;
    const userDatafromDB = await getUserProfile(email!);

    const currentUser = {
      id: userDatafromDB?.id,
      email: user.email,
      role: (userDatafromDB?.role ?? "USER") as IUserProfileRoleType,
      fullname: userDatafromDB?.fullname ?? "",
      avatar: userDatafromDB?.avatar ?? null,
      created_at: user.created_at,
      updated_at: user.updated_at,
      isUserVerified: user.user_metadata?.isUserVerified ?? false,
    };

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: currentUser,
    });
  } catch (err: unknown) {
    const fallback = err as AuthError;
    throw {
      status: fallback?.status || 500,
      message: fallback?.message || "Unexpected error during profile fetch.",
    };
  }
};

export const refreshTokenAuthController = async (
  req: Request,
  res: Response
) => {

  try {

    const refreshToken = req.cookies.refreshtoken as string;
    // Defensive fallback for remember flag
    const remember =
      typeof req.body === "object" && req.body !== null && "remember" in req.body
        ? Boolean((req.body as { remember?: boolean }).remember)
        : false;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "Unauthorized", data: null });
    }

    const result = await refreshTokenUser({ refreshToken });
    const { session } = result.data as { session: Session };
    if (!session?.access_token || !session?.refresh_token) {
      return res.status(500).json({
        success: false,
        status: "error",
        message: "Token generation failed",
        data: null,
      });
    }

    const accessTokenExpiresIn = remember ? getCookieExpiryInDays(1) : getCookieExpiryInMinutes(15);

    res.cookie("accesstoken", session.access_token, {
      maxAge: accessTokenExpiresIn,
    });

    res.cookie("refreshtoken", session.refresh_token, {
      maxAge: remember ? getCookieExpiryInDays(30) : getCookieExpiryInDays(7),
    });

    return res.status(200).json({
      success: true,
      message: "Tokens are refreshed successfully",
      tokenExpiresIn: accessTokenExpiresIn,
      data: null,
    });

  } catch (err: unknown) {
    const fallback = err as AuthError;
    throw {
      status: fallback?.status || 500,
      message:
        fallback?.message || "Unexpected error during password recovery.",
    };
  }
};