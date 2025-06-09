import ApiError from "../error/ApiError.js";
import { User } from "../models/models.js";
import { compareSync, hash } from "bcrypt";
import jwt from "jsonwebtoken";
const { sign } = jwt;
import { validationResult } from "express-validator";

const generateJwt = (id, role) => {
    const payload = { id, role };
    return sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1000d" });
};

class AuthController {
    //Регистрация
    async register(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json({ message: "Ошибка регистрации", errors });
            }

            const { firstName, lastName, email, password, phone, role } =
                req.body;

            //Хеширование пароля
            const hashPassword = await hash(password, 5);

            //Создание пользователя
            const user = await User.create({
                firstName,
                lastName,
                email,
                password: hashPassword,
                phone,
                role,
            });
            res.status(201).json({
                id: user.id,
                email: user.email,
                role: user.role,
                message: "Пользователь успешно зарегистрирован",
            });
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }

    //Вход в систему
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            //Проверка существования пользователя
            const user = await User.findOne({ where: { email } });
            if (user) {
                let comparePassword = compareSync(password, user.password);
                if (!comparePassword) {
                    return next(ApiError.badRequest("Неверный пароль"));
                }
                const token = generateJwt(user.id, user.role);
                return res
                    .cookie("token", token, {
                        secure: true,
                        sameSite:
                            process.env.NODE_ENV === "production"
                                ? "none"
                                : "lax",
                    })
                    .json(user, token);
            }
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }

    //Выход из системы
    async logout(req, res, next) {
        try {
            //Сброс токена из куки
            res.cookie("token", "").json(true);
        } catch (error) {
            next(ApiError.internal(error));
        }
    }

    async check(req, res, next) {
        // const token = generateJwt(req.user.id, req.user.email, req.user.role)
        // return res.json({token})
    }
}

const authController = new AuthController();
export default authController;
