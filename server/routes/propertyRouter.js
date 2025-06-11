import { Router } from "express";
import propertyController from "../controllers/propertyController.js";
import authFunction from "../middlewares/authMiddleware.js";
import checkRoleFunction from "../middlewares/checkRoleMiddleware.js";

const propertyRouter = new Router();

// Публичные роуты
propertyRouter.get("/", propertyController.getAllProperties);
propertyRouter.get("/:id", propertyController.getProperty);

// Приватные роуты (требуют авторизации)
propertyRouter.get(
    "/user-properties",
    authFunction,
    propertyController.getUserProperties
);
propertyRouter.post("/", authFunction, propertyController.createProperty);
propertyRouter.put("/:id", authFunction, propertyController.updateProperty);
propertyRouter.delete("/:id", authFunction, propertyController.deleteProperty);

export default propertyRouter;
