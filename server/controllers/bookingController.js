import ApiError from "../error/ApiError.js";
import { Booking, Property, User } from "../models/models.js";
import { Op } from "sequelize";

class BookingController{
    
    async getAllBookings(req,res,next){
        try{
            const bookings = await Booking.findAll()
            return res.json(bookings)
        }
        catch{
            return next(ApiError.internal(error.message))
        }

    }

    async getBooking(req,res,next){
        try{
            const {id} = req.params
            const booking = await Booking.findByPk(id)
            
            if (!booking){
                return res.json({message : "Бронирование не найдено"})
            }

            return res.json(booking)

        }catch(error){
            return next(ApiError.internal(error.message))

        }
    }

    async cancelBooking(req,res,next){
        try{
            const {id} = req.body
            const booking = await Booking.findByPk(id)

            if (!booking){
                return next(ApiError.badRequest("Бронирование не найдено"))
            }

            if(booking.userId !== req.user.id){
                return res.stauts(403).json(
                    {error : "Вы не можете отменять чужие бронирования"}
                )
            }

            await booking.update({status: 'cancelled'})
            return res.json({message: "Бронирование отменено"})
        }catch(error){
            next(ApiError.internal(error.message))
        }
    }

    async createBooking(req,res,next){
        try{
            const {propertyId, checkInDate, checkOutDate, guestsCount} = req.body
            const userId = req.user.id
            
            //Проверка доступности жилья на указанные даты
            const exestingBooking = await Booking.findOne({
                where: {
                    propertyId,
                    [Op.or] : [
                        {
                            checkInDate: { [Op.between]: [checkInDate,checkOutDate]},
                        },
                        {
                            checkOutDate : {[Op.between]: [checkInDate, checkOutDate]},
                        },
                    ],
                    
                }
            })

            if (exestingBooking){
                return res.status(400).json({error : "Жилье уже занято на эти даты"})
            }

            //Рассчитывание общей стоимости
            const property = await Property.findByPk(propertyId)
            const nights = Math.ceil(
                (new Date(checkOutDate) - new Date(checkInDate)) / (1000*60*60*24)
            )
            const totalPrice = nights * property.pricePerNight

            //Создание бронирования

            const booking = await Booking.create({
                propertyId,userId,checkInDate,checkOutDate,guestsCount,totalPrice,
                status : 'confirmed'
            })
            res.json(booking)
        }catch(error){
            return next(ApiError.internal(error.message))
        }

    }

}

const bookingController = new BookingController()
export default bookingController

