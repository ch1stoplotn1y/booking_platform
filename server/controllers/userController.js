import ApiError from "../error/ApiError.js";
import path from "path";
import fs from "fs";
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
        const users = await User.findAndCountAll();
        return res.json(users);
    }

    async getUserProfile(req, res, next) {
        try {
            const user = await User.findByPk(req.user.id, {
                attributes: { exclude: ["password"] },
                include: [{ model: Booking }, { model: Property }],
            });
            if (!user) {
                return next(ApiError.notFound("Пользователь не найден"));
            }
            return res.json(user);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }

    async getUserById(req, res, next) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id, {
                attributes: {
                    exclude: ["password"],
                },
                include: [{ model: Booking }],
            });
            if (!user) {
                return next(ApiError.badRequest("Пользователь не найден"));
            }
            return res.json(user);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }

    async getUserByEmail(req, res, next) {
        try {
            const { email } = req.query;
            const user = await User.findOne({ where: { email } });
            return res.json(user);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }

    async updateAvatar(req, res, next) {
        try {
            const { id } = req.user;

            if (!req.files?.avatar) {
                return next(ApiError.badRequest("Аватар не загружен"));
            }

            const avatar = req.files.avatar;

            // Генерация уникального имени файла
            const fileName = `avatar_${id}_${Date.now()}${path.extname(
                avatar.name
            )}`;
            const uploadPath = path.resolve("static", "avatars", fileName);

            // Создание папки, если её нет
            if (!fs.existsSync(path.resolve("static", "avatars"))) {
                fs.mkdirSync(path.resolve("static", "avatars"), {
                    recursive: true,
                });
            }

            // Сохранение файла
            await avatar.mv(uploadPath);

            // Обновление в БД
            const avatarPath = `/static/avatars/${fileName}`;
            await User.update({ avatar: avatarPath }, { where: { id } });

            return res.json({
                success: true,
                avatarUrl: avatarPath,
            });
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }

    async deleteAvatar(req, res, next) {
        try {
            const { id } = req.user;
            const user = await User.findByPk(id);

            if (!user) {
                return next(ApiError.badRequest("Пользователь не найден"));
            }

            // Если аватар существует
            if (user.avatar) {
                // Удаляем файл аватара
                const avatarPath = path.resolve(
                    "static",
                    user.avatar.replace("/static/", "")
                );
                if (fs.existsSync(avatarPath)) {
                    fs.unlinkSync(avatarPath);
                }

                // Обновляем запись в БД
                await user.update({ avatar: null });
            }

            return res.json({ success: true });
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
                include: [
                    {
                        model: Property,
                        include: [
                            {
                                model: PropertyImage,
                            },
                            {
                                model: PropertyReview,
                            },
                        ],
                    },
                ],
            });
            return res.json(bookings);
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }

    async getUserBookingsAsHost(req, res, next) {
        try {
            const bookings = await Booking.findAndCountAll({
                where: { userId: req.user.id },
            });
            return res.json(bookings);
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }

    //Метод обновления пользователя для админ панели
    async updateUser(req, res, next) {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return res
                    .status(404)
                    .json({ message: "Пользователь не найден" });
            }

            const { firstName, lastName, email, phone, role } = req.body;

            // Проверка, что email не занят другим пользователем
            if (email && email !== user.email) {
                const existingUser = await User.findOne({ where: { email } });
                if (existingUser) {
                    return res
                        .status(400)
                        .json({ message: "Email уже используется" });
                }
            }

            await user.update({ firstName, lastName, email, phone, role });
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

const userController = new UserController();
export default userController;
