import {
    PropertyReview,
    HostReview,
    Booking,
    Property,
    User,
} from "../models/models.js";
import ApiError from "../error/ApiError.js";
import { json } from "sequelize";
import sequelize from "../db.js";

//CRUD для отзывов о жилье и хозяине
class ReviewController {
    async getUserHostReviews(req, res, next) {
        try {
            const { userId } = req.params;
            const userHostReviews = await HostReview.findAll({
                where: { userId },
            });

            return res.json(userHostReviews);
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }

    async getUserPropertyReviews(req, res, next) {
        try {
            const { userId } = req.params;
            const userPropertyReviews = await PropertyReview.findAll({
                where: { userId },
            });

            return res.json(userPropertyReviews);
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }

    //Функция для обновления общего (среднего) рейтинга жилья
    async updatePropertyRating(propertyId) {
        const reviews = await PropertyReview.findAll({
            where: { propertyId },
            attributes: [
                [sequelize.fn("AVG", sequelize.col("rating")), "avgRating"],
            ],
        });

        if (!reviews) {
            console.log("error");
            return next(ApiError.internal(error.message));
        }

        await Property.update(
            {
                rating: reviews[0].dataValues.avgRating,
            },
            { where: { id: propertyId } }
        );
    }

    //Создание отзыва
    async createPropertyReview(req, res, next) {
        try {
            const {
                bookingId,
                rating,
                comment,
                cleanliness,
                accuracy,
                communication,
                location,
                checkIn,
            } = req.body;

            const userId = req.user.id;

            //Проверка на существование бронирования и принаждежности пользователю
            const booking = await Booking.findOne({
                where: { id: bookingId, userId },
                include: [{ model: Property }],
            });

            if (!booking) {
                return next(
                    ApiError.badRequest(
                        "Бронирование не найдено или не принадлежит вам"
                    )
                );
            }

            //Потенциальные проверки количествов отзывов пользователя на один объект
            //Или на истечение даты бронирования (чтобы оставить отзыв можно было только после выселения)
            //Но подразумеваем что пользователь может оставить несколько отзывов об одном жилье, то есть
            //при желании дописать что то, и в любое время, даже прожив один день

            const review = await PropertyReview.create({
                bookingId,
                propertyId: booking.propertyId,
                userId,
                rating,
                comment,
                cleanliness,
                accuracy,
                communication,
                location,
                checkIn,
            });

            //Обновление среднего рейтинга жилья после каждого отзыва
            await reviewController.updatePropertyRating(booking.propertyId);

            return res.json(review);
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }

    //Создание отзыва о хозяине объекта
    async createHostReview(req, res, next) {
        try {
            const { bookingId, hostId, rating, comment } = req.body;
            const userId = req.user.id; // Проверьте, что мидлвэр добавляет user
            console.log(req.user.id);

            if (!userId) {
                return next(ApiError.badRequest("Пользователь не авторизован"));
            }

            const booking = await Booking.findOne({
                where: { id: bookingId, userId },
                include: [
                    {
                        model: Property,
                    },
                ],
            });

            if (!booking) {
                return next(ApiError.badRequest("Бронирование не найдено"));
            }

            const review = await HostReview.create({
                bookingId,
                hostId,
                userId: req.user.id,
                rating,
                comment,
            });

            await reviewController.updateHostRating(hostId);
            return res.json(review);
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }
    //Получение отзывов о жилье

    async getPropertyReviews(req, res, next) {
        try {
            const { propertyId } = req.params;
            const { limit = 10, offset = 10 } = req.query;

            const reviews = await PropertyReview.findAndCountAll({
                where: { propertyId },
                include: [
                    {
                        model: User,
                        attributes: ["id", "firstName", "lastName", "avatar"],
                    },
                ],
                order: [["createdAt", "DESC"]],
                limit: parseInt(limit),
                ofsset: parseInt(offset),
            });
            return res.json(reviews);
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }

    //Получение отзывов о хозяине

    async getHostReviews(req, res, next) {
        try {
            const { hostId } = req.params;
            const { limit = 10, offset = 0 } = req.query;

            const reviews = await HostReview.findAndCountAll({
                where: { hostId },
                include: [
                    {
                        model: User,
                        as: "User",
                        attributes: ["id", "firstName", "lastName", "avatar"],
                        order: [["createdAt", "DESC"]],
                        limit: parseInt(limit),
                        offset: parseInt(offset),
                    },
                ],
            });

            return res.json(reviews);
        } catch (error) {}
    }

    //Аналогичная функция для обновления общего (среднего) рейтинга хозяина
    async updateHostRating(hostId) {
        const avgRating = await HostReview.findAll({
            where: { hostId },
            attributes: [
                [sequelize.fn("AVG", sequelize.col("rating")), "avgRating"],
            ],
        });

        await User.update(
            {
                hostRating: avgRating[0].dataValues.avgRating,
            },
            { where: { id: hostId } }
        );
    }

    //Удаление отзыва о жилье (админ)
    async deletePropertyReview(req, res, next) {
        try {
            const { id } = req.params;
            const review = await PropertyReview.findByPk(id);

            if (!review) {
                return next(ApiError.internal(error.message));
            }
            await review.destroy();
            await this.updatePropertyRating(review.propertyId);
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }

    //Удаление отзыва о хозяине (админ)
    async deleteHostReview(req, res, next) {
        try {
            const { id } = req.params;
            const review = await HostReview.findByPk(id);

            if (!review) {
                return next(ApiError.internal(error.message));
            }
            await review.destroy();
            await this.updateHostRating(review.userId);
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }
}

const reviewController = new ReviewController();
export default reviewController;
