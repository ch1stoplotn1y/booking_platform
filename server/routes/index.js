import { Router } from "express";
const router = new Router();

import authRouter from "./authRouter.js";
import userRouter from "./userRouter.js";
import amenityRouter from "./amenityRouter.js";
import propertyRouter from "./propertyRouter.js";
import bookingRouter from "./bookingRouter.js";
import reviewRouter from "./reviewRouter.js";
import wishRouter from "./wishRouter.js";
import messageRouter from "./messageRouter.js";
import uploadRouter from "./uploadRouter.js";

router.use("/auths", authRouter);
router.use("/users", userRouter);
router.use("/amenities", amenityRouter);
router.use("/properties", propertyRouter);
router.use("/bookings", bookingRouter);
router.use("/reviews", reviewRouter);
router.use("/wishes", wishRouter);
router.use("/messages", messageRouter);
router.use("/uploads", uploadRouter);

export default router;
