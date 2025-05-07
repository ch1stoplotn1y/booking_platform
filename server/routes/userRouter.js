import { Router } from "express";
import userController from "../controllers/userController.js";
import checkRoleFunction from "../middlewares/checkRoleMiddleware.js";
import authFunction from "../middlewares/authMiddleware.js";

const userRouter = new Router();

userRouter.get(
  "/users",
  checkRoleFunction("admin"),
  userController.getAllUsers
);

userRouter.get("/:id", authFunction, userController.getUserById);
userRouter.get("/me", authFunction, userController.getUserProfile);
userRouter.patch("/me", authFunction, userController.updateUserProfile);
userRouter.delete("/me", authFunction, userController.deleteUser);
userRouter.get(
  "/me/properties",
  authFunction,
  userController.getUserProperties
);
userRouter.get("/me/bookings", authFunction, userController.getUserBookings);

export default userRouter;
