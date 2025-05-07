import { Router } from "express";
import amenityController from "../controllers/amenityController.js";
import checkRoleFunction from "../middlewares/checkRoleMiddleware.js";

const amenityRouter = new Router();

amenityRouter.get(
  "/",
  checkRoleFunction("admin"),
  amenityController.getAllAmenities
);
amenityRouter.post(
  "/",
  checkRoleFunction("admin"),
  amenityController.createAmenity
);

export default amenityRouter;
