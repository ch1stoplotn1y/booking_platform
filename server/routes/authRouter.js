import { Router } from "express";
import authController from "../controllers/authController.js";
import authFunction from "../middlewares/authMiddleware.js";
import { check } from "express-validator";

const authRouter = new Router();

//Ендпоинты для регистрации и авторизации
authRouter.post("/registration", authController.register);
authRouter.post("/logout", authFunction, authController.logout);
authRouter.post("/login", authController.login);
authRouter.get("/loggedin", authFunction, authController.check);

export default authRouter;
