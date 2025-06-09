import { Router } from "express";
import userController from "../controllers/userController.js";
import checkRoleFunction from "../middlewares/checkRoleMiddleware.js";
import authFunction from "../middlewares/authMiddleware.js";

const userRouter = new Router();
//Ендпоинты для профиля пользователя
userRouter.get(
    "/users",
    checkRoleFunction("admin"),
    userController.getAllUsers
);

userRouter.get("/me", authFunction, userController.getUserProfile);
userRouter.patch("/me/avatar", authFunction, userController.updateAvatar);
userRouter.patch("me/avatar/delete", userController.deleteAvatar);
userRouter.delete("/me", authFunction, userController.deleteUser);
userRouter.get(
    "/me/properties",
    authFunction,
    userController.getUserProperties
);
userRouter.get("/me/bookings", authFunction, userController.getUserBookings);
userRouter.get("/:id", userController.getUserById);
export default userRouter;
