import { Request, Response } from "express";
import { AuthError } from "@supabase/supabase-js";
import { updateUserFullname } from "./user.helper";
import { AuthenticatedRequest } from "./user.middleware";

interface IUserUpdateFullname {
    fullname: string;
}

export const updateUserFullnameController = async (
    req: AuthenticatedRequest,
    res: Response,
) => {
    try {
        const { fullname } = req.body as IUserUpdateFullname;

        if (!fullname || typeof fullname !== "string" || fullname.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid fullname provided",
                data: null,
            });
        }

        const email = req.user?.email;
        if (!email) {
            return res.status(403).json({
                success: false,
                message: "User does not exist",
                data: null,
            });
        }

        const result = await updateUserFullname(fullname.trim(), email);

        return res.status(200).json({
            success: true,
            message: "Fullname updated successfully",
            data: result,
        });
    } catch (err: unknown) {
        const fallback = err as AuthError;
        throw {
            status: fallback?.status || 500,
            message: fallback?.message || "Unexpected error during login.",
        };
    }
};