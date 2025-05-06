import ApiError from "../error/ApiError.js"
import { User } from "../models/models.js"
import {compareSync, hash} from 'bcrypt'
import jwt from 'jsonwebtoken'
const {sign} = jwt
import { validationResult } from "express-validator"

// const generateJwt = (id,role)=>{
//     const payload = {id, role}
//     const accessToken =  sign(
//         payload,
//         process.env.JWT_SECRET_KEY,
//         {expiresIn: '24h'}
//     )
//     const refreshToken =  sign(
//         payload,
//         process.env.JWT_SECRET_REFRESH_KEY,
//         {expiresIn: '1000d'}
//     )
//     return {accessToken, refreshToken}
  
// }

const generateJwt = (id,role)=>{
    const payload = {id, role}
    return sign(
        payload,
        process.env.JWT_SECRET_KEY,
        {expiresIn: '1000d'}
    )  
  
}

class AuthController{
    //Регистрация
    async register(req,res,next){
        try{
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                return res.status(400).json({message: "Ошибка регистрации", errors})
            }

            const {firstName, lastName, email, password, phone, role} = req.body

            // //Проверка на пустоту полей
            // if(!firstName || !lastName || !email || !password || !phone){
            //     return next(ApiError.badRequest("Заполнены не все поля"))
            // }

            // //Валидация имени (только буквы и пробелы, 2-50 символов)
            // const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s-]{2,50}$/
            // if(!nameRegex.test(firstName)){
            //     return next(ApiError.badRequest("Имя должно содержать только буквы и 2-50 символов"))
            // }

            // //Валидация email
            // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            // if (!emailRegex.test(email)){
            //     return next(ApiError.badRequest("Некорректный email"))
            // }

            // //Валидация пароля (минимум 8 символов)
            // if(password.length < 8){
            //     return next(ApiError.badRequest("Пароль должен быть не короче 8 символов"))
            // }

            // //Валидация телефона на российский формат
            // const phoneRegex = /^\+7\d{10}$/
            // if(!phoneRegex.test(phone)){
            //     return next(ApiError.badRequest("Телефон должен быть в формате +79123927566"))
            // }

            // //Проверка существования пользователя с заданным email
            // const exestingUser = await User.findOne({
            //     where : {email}
            // })
            // if(exestingUser){
            //     return next(ApiError.badRequest("Пользователь с таким email уже существует"))
            // }

            //Хеширование пароля
            const hashPassword = await hash(password,5)

            //Создание пользователя
            const user = await User.create({firstName,lastName,email,password : hashPassword,phone,role})
            res.status(201).json({
                id : user.id,
                email : user.email,
                role : user.role,
                message : "Пользователь успешно зарегистрирован"
            })
            }catch(error){
                next(ApiError.internal(error.message))
            }   
    }

    //Вход в систему
    async login(req,res,next){   
        try{
            const {email,password} = req.body
            //Проверка существования пользователя
            const user = await User.findOne({where:{email}})
            if(!user){
                return next(ApiError.badRequest("Пользователь с таким email не найден"))
            }
            
            //Сравнения введенного пароля и того что лежит в БД 
            let comparePassword = compareSync(password, user.password)
            if (!comparePassword){
                return next(ApiError.badRequest("Неверный пароль"))
            }

            const token = generateJwt(user.id, user.role)

            res.set('Authorization', `Bearer ${token}`);
            return res.status(201).json({
                message : `Добро пожаловать, ${user.firstName} ${user.lastName}`,
                token : token
        })

        } catch(error){
            return next(ApiError.internal(error.message))
        }

        
    }


    async check(req,res,next){
        // const token = generateJwt(req.user.id, req.user.email, req.user.role)
        // return res.json({token})
    }
}

const authController = new AuthController()
export default authController
