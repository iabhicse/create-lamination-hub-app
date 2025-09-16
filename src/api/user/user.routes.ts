import { Router } from "express";
import createAuthErrorHandler from "./user.error";
import * as userControllers from "./user.controllers";

const userRoutes: ReturnType<typeof Router> = Router();

//all api routes for auth services
userRoutes.put(
    "/update-user-fullname",
    userControllers.updateUserFullnameController,
    createAuthErrorHandler("update-user-fullname")
);



export default userRoutes;

export type routesOptions =
    | "update-user-fullname"
    | "update-user-email"