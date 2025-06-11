import ApiError from "../error/ApiError.js";
import {
    Booking,
    Property,
    PropertyImage,
    PropertyReview,
    User,
    Amenity,
} from "../models/models.js";
import { Op } from "sequelize";

//CRUD для бронирований
class BookingController {
    async getAllBookings(req, res, next) {
        try {
            const bookings = await Booking.findAndCountAll({
                include: [{ model: Property }, { model: User }],
            });
            return res.json(bookings);
        } catch {
            return next(ApiError.internal(error.message));
        }
    }

    async getBooking(req, res, next) {
        try {
            const { id } = req.params;
            const booking = await Booking.findByPk(id, {
                include: [
                    {
                        model: Property,
                        include: [
                            { model: PropertyImage },
                            { model: Amenity },
                            { model: User },
                        ],
                    },
                    {
                        model: PropertyReview,
                    },
                ],
            });

            if (!booking) {
                return res.json({ message: "Бронирование не найдено" });
            }

            return res.json(booking);
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }

    async cancelBooking(req, res, next) {
        try {
            const { id } = req.body;
            const booking = await Booking.findByPk(id);

            if (!booking) {
                return next(ApiError.badRequest("Бронирование не найдено"));
            }

            if (booking.userId !== req.user.id) {
                return res.stauts(403).json({
                    error: "Вы не можете отменять чужие бронирования",
                });
            }

            await booking.update({ status: "cancelled" });
            return res.json({ message: "Бронирование отменено" });
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }

    async createBooking(req, res, next) {
        try {
            const { propertyId, checkInDate, checkOutDate, guestsCount } =
                req.body;
            const userId = req.user.id;

            //Проверка доступности жилья на указанные даты
            const exestingBooking = await Booking.findOne({
                where: {
                    propertyId,
                    [Op.or]: [
                        {
                            checkInDate: {
                                [Op.between]: [checkInDate, checkOutDate],
                            },
                        },
                        {
                            checkOutDate: {
                                [Op.between]: [checkInDate, checkOutDate],
                            },
                        },
                    ],
                },
            });

            if (exestingBooking) {
                return res
                    .status(400)
                    .json({ error: "Жилье уже занято на эти даты" });
            }

            //Рассчитывание общей стоимости
            const property = await Property.findByPk(propertyId);
            const nights = Math.ceil(
                (new Date(checkOutDate) - new Date(checkInDate)) /
                    (1000 * 60 * 60 * 24)
            );
            const totalPrice = nights * property.pricePerNight;

            //Создание бронирования

            const booking = await Booking.create({
                propertyId,
                userId,
                checkInDate,
                checkOutDate,
                guestsCount,
                totalPrice,
                status: "confirmed",
            });
            res.json(booking);
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }

    async deleteBooking(req, res, next) {
        try {
            const { id } = req.params;

            const booking = await Booking.findOne({
                where: { id, userId: req.user.id },
            });

            if (!booking) {
                return next(
                    ApiError.badRequest("Вы не можете удалить чужой объект")
                );
            }

            await booking.destroy();
            res.json({ message: "Объект удален" });
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }

    //Метод обновления данных бронирования для админ панели
    async updateBooking(req, res, next) {
        try {
            const booking = await Booking.findByPk(req.params.id);
            if (!booking) {
                return res
                    .status(404)
                    .json({ message: "Бронирование не найдено" });
            }

            const { checkInDate, checkOutDate, guestsCount, status } = req.body;

            // Проверка дат
            if (new Date(checkInDate) >= new Date(checkOutDate)) {
                return res
                    .status(400)
                    .json({
                        message: "Дата выезда должна быть позже даты заезда",
                    });
            }

            await booking.update({
                checkInDate,
                checkOutDate,
                guestsCount,
                status,
            });
            res.json(booking);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

const bookingController = new BookingController();
export default bookingController;
