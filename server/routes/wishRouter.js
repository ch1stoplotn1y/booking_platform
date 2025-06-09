import { Router } from "express";
import wishController from "../controllers/wishController.js";
import authFunction from "../middlewares/authMiddleware.js";

const wishRouter = new Router();

//Роуты для
wishRouter.post("/", authFunction, wishController.addToWish);
wishRouter.get("/", authFunction, wishController.getUserWishList);
wishRouter.delete("/:id", authFunction, wishController.removeFromWish);

export default wishRouter;
