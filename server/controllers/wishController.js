import { Wish, Property, User, PropertyImage } from "../models/models.js";
import ApiError from "../error/ApiError.js";

class WishController {
  //Добавление в избранное

  async addToWish(req, res, next) {
    try {
      const { propertyId } = req.body;
      const userId = req.user.id;

      //Проверка есть ли уже объект в избранном
      const exestingWish = await Wish.findOne({
        where: { userId, propertyId },
      });

      if (exestingWish) {
        return next(ApiError.badRequest("Вы уже добавили это в избранное"));
      }

      const wish = await Wish.create({ userId, propertyId });
      return res.json(wish);
    } catch (error) {
      return next(ApiError.internal(error.message));
    }
  }

  //Удаление из избранного
  async removeFromWish(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const wish = await wish.findOne({
        where: { id, userId },
      });

      if (!wish) {
        return next(ApiError.badRequest("Объект не найден в избранном"));
      }

      await wish.destroy();
      return res.json({ message: `Удалено из избранного` });
    } catch (error) {}
  }

  //Получение избранного пользователя
  async getUserWishList(req, res, next) {
    try {
      const userId = req.user.id;
      const { limit = 20, offset = 0 } = req.query;

      const wishList = await Wish.findAndCountAll({
        where: { userId },
        include: [
          {
            model: Property,
            include: [PropertyImage],
          },
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["createdAt", "DESC"]],
      });

      return res.json(wishList);
    } catch (error) {
      return next(ApiError.internal(error.message));
    }
  }
}

const wishController = new WishController();
export default wishController;
