import { getUserByToken } from "../auth/auth.helper";
import { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        [key: string]: unknown; // Extend as needed
    };
}

export const authenticateUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies?.accesstoken;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token missing",
                data: null,
            });
        }

        const user = await getUserByToken(token);
        if (!user?.email) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Invalid token or user not found",
                data: null,
            });
        }



        req.user = {
            id: user.id,
            email: user.email,
        }
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during authentication",
            data: null,
        });
    }
};