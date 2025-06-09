import { Router } from "express";
import uploadController from "../controllers/uploadController.js";
import authFunction from "../middlewares/authMiddleware.js";
const uploadRouter = new Router();

uploadRouter.post("/link", authFunction, uploadController.uploadByLink);
uploadRouter.post("/device", uploadController.uploadFromDevice);

export default uploadRouter;
