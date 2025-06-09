import { Router } from "express";
import amenityController from "../controllers/amenityController.js";
import checkRoleFunction from "../middlewares/checkRoleMiddleware.js";

const amenityRouter = new Router();

//Роуты для создания и получения amenities (удобства (wi-fi, kitchen))

amenityRouter.get("/", amenityController.getAllAmenities);
amenityRouter.post(
    "/",
    checkRoleFunction("admin"),
    amenityController.createAmenity
);

export default amenityRouter;
