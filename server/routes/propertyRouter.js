import { Router } from "express";
import propertyController from "../controllers/propertyController.js";
import authFunction from "../middlewares/authMiddleware.js";

const propertyRouter = new Router();

propertyRouter.get("/:id", propertyController.getProperty);
propertyRouter.get("/", propertyController.getAllProperties);
propertyRouter.post("/", authFunction, propertyController.createProperty);
propertyRouter.put("/:id", authFunction, propertyController.updateProperty);
propertyRouter.delete("/:id", authFunction, propertyController.deleteProperty);

export default propertyRouter;
