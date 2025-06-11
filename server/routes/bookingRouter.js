import { Router } from "express";
import bookingController from "../controllers/bookingController.js";
import authFunction from "../middlewares/authMiddleware.js";
import checkRoleFunction from "../middlewares/checkRoleMiddleware.js";

//Ендпоинты для бронирований
const bookingRouter = new Router();

bookingRouter.get("/:id", authFunction, bookingController.getBooking);
//Админ панель
bookingRouter.get(
    "/",
    checkRoleFunction("admin"),
    bookingController.getAllBookings
);
bookingRouter.delete(
    "/:id",
    checkRoleFunction("admin"),
    bookingController.deleteBooking
);
bookingRouter.put(
    "/:id",
    checkRoleFunction("admin"),
    bookingController.updateBooking
);

//Пользовательские
bookingRouter.post("/", authFunction, bookingController.createBooking);
bookingRouter.post("/cancel", bookingController.cancelBooking);

export default bookingRouter;
