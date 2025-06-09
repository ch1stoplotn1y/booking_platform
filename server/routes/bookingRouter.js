import { Router } from "express";
import bookingController from "../controllers/bookingController.js";
import authFunction from "../middlewares/authMiddleware.js";
import checkRoleFunction from "../middlewares/checkRoleMiddleware.js";

//Ендпоинты для бронирований
const bookingRouter = new Router();

bookingRouter.get("/:id", authFunction, bookingController.getBooking);
bookingRouter.get(
    "/",
    checkRoleFunction("admin"),
    bookingController.getAllBookings
);
bookingRouter.post("/", authFunction, bookingController.createBooking);
bookingRouter.post("/cancel", bookingController.cancelBooking);

export default bookingRouter;
