import { Router } from "express"
import authController from "../controllers/authController.js"
import authFunction from "../middlewares/authMiddleware.js"
import { check } from "express-validator"


const authRouter = new Router()

authRouter.post('/registration',
    [check('firstName', "Не введено имя").notEmpty(),
    check('lastName', "Не введена фамилия").notEmpty(),
    check('password', "Не введен пароль").notEmpty(),
    check('password', "Пароль должен быть от 4 символов").isLength({min:4,max:20}),
    check('email', "Не введен email").notEmpty(),
    check('phone', "Не введен телефон").notEmpty()
],authController.register)
authRouter.post('/login', authController.login)
authRouter.get('/loggedin', authFunction, authController.check)

export default authRouter

