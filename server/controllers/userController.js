import ApiError from "../error/ApiError.js";
import {
  User,
  Property,
  Booking,
  PropertyReview,
  HostReview,
  PropertyImage,
  Amenity,
  PropertyAmenities,
} from "../models/models.js";

class UserController {
  async getAllUsers(req, res) {
    const users = await User.findAll();
    return res.json(users);
  }

  async getUserProfile(req, res, next) {
    try {
      const user = await User.findOne({ where: { id: req.user.id } });
      return res.json(user);
    } catch (error) {
      next(ApiError.internal(error.message));
    }
  }

  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      return res.json(user);
    } catch (error) {
      next(ApiError.internal(error.message));
    }
  }

  async updateUserProfile(req, res, next) {
    try {
      const [updated] = await User.update(req.body, {
        where: { id: req.user.id },
        returning: true,
        individualHooks: true,
      });
      if (!updated) {
        return next(ApiError.badRequest("Не найден пользователь"));
      }

      const user = await User.findByPk(req.user.id);
      return res.json(user);
    } catch (error) {
      next(ApiError.internal(error.message));
    }
  }

  async deleteUser(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return next(ApiError.badRequest("Не найден пользователь"));
      }

      await user.destroy();
      res.clearCookie("refreshToken");
    } catch (error) {
      return next(ApiError.internal(error.message));
    }
  }

  async getUserProperties(req, res, next) {
    try {
      const properties = await Property.findAll({
        where: { userId: req.user.id },
        include: [
          {
            model: Amenity,
            through: {
              model: PropertyAmenities,
              attributes: [],
            },
            attributes: ["id", "name"],
          },
          {
            model: PropertyImage,
            attributes: ["id", "path", "isMain"],
          },
        ],
      });
      return res.json(properties);
    } catch (error) {
      return next(ApiError.internal(error.message));
    }
  }

  async getUserBookings(req, res, next) {
    try {
      const bookings = await Booking.findAll({
        where: { userId: req.user.id },
      });
      return res.json(bookings);
    } catch (error) {
      return next(ApiError.internal(error.message));
    }
  }
}

const userController = new UserController();
export default userController;
