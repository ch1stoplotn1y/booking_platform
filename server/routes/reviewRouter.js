import { Router } from "express";
import reviewController from "../controllers/reviewController.js";
import authFunction from "../middlewares/authMiddleware.js";
import checkRoleFunction from "../middlewares/checkRoleMiddleware.js";

const reviewRouter = new Router();

//Для отзывов о жилье (PropertyReview)
reviewRouter.post(
  "/property-reviews",
  authFunction,
  reviewController.createPropertyReview
);
reviewRouter.get(
  "property-reviews/:propertyId",
  reviewController.getPropertyReviews
);

//Для отзывов о хозяевах (HostReview)
reviewRouter.post(
  "/host-reviews",
  authFunction,
  reviewController.createHostReview
);
reviewRouter.get("host-reviews/:hostId", reviewController.getHostReviews);

//Админские роуты
reviewRouter.delete(
  "/property-reviews/:id",
  checkRoleFunction("admin"),
  reviewController.deletePropertyReview
);
reviewRouter.delete(
  "/host-reviews/:id",
  checkRoleFunction("admin"),
  reviewController.deleteHostReview
);

export default reviewRouter;
