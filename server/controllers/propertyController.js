import ApiError from "../error/ApiError.js"
import { Property, Amenity, PropertyAmenities, Wish, PropertyImage,
    Booking, PropertyReview, User
 } from "../models/models.js"
 import {Op} from 'sequelize'
 import path from 'path'
import { fileURLToPath } from 'url'
import { v4 } from 'uuid'
import { dirname } from "path"
import { resolve } from "path"




//Для загрузки изображений в static

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

//Для парсинга поля amenities при передаче через form-data
//В виде key : amenities, value : [1,2,3], а не отдельно
//Для удобства отправки запросов
function parseAmenities(amenities) {
    if (!amenities) return [];
    
    if (Array.isArray(amenities)) {
        return amenities.map(Number);
    }
    
    if (typeof amenities === 'string') {
        try {
            return JSON.parse(amenities);
        } catch (error) {
            return amenities.split(',').map(Number);
        }
    }
    
    return [];
}



 class PropertyController{

    async getAllProperties(req,res,next){
        try{
            const properties = await Property.findAll()
            return res.json(properties)
        }catch(error){
            return next(ApiError.internal(error.message))
        }
    }

    //Получение объекта по айди
    async getProperty(req,res,next){
        try{
            const {id} = req.params
            const property = await Property.findByPk(id,{
                include: [
                    {model : Amenity, attributes: ['id', 'name']},
                    {model : PropertyImage, attributes: ['id', 'path']},
                ]
            })

            if (!property){
                return next(ApiError.badRequest("Объект не найден"))
            }
            return res.json(property)

        }catch(error){
            next(ApiError.internal(error.message))

        }
    }

    //Обновление объекта
    async updateProperty(req,res,next){
        try{
            const {id} = req.params
            const {amenities,images, ...propertyData} = req.body
            
            //Проверка на существование + принадлежность пользователю
            const property = await Property.findOne({
                where : {id, userId : req.user.id}
            })

            if (!property) {
                return next(ApiError.badRequest("Вы не можете изменять чужой объект"))
            }

            await property.update(propertyData)
            if (amenities){
                await property.setAmenities(amenities) //замена текущих удобств
            }

            const updatedProperty = await Property.findByPk(id,{
                include : [Amenity, PropertyImage]
            })

            return res.json(updatedProperty)

        }catch (error){
            next(ApiError.internal(error.message))

        }
    }

    //Удаление объекта
    async deleteProperty(req,res,next){
        try{
            const {id} = req.params
            
            const property = await Property.findOne({
                where : {id, userId : req.user.id}
            })
            
            if (!property){
                return next(ApiError.badRequest("Вы не можете удалить чужой объект"))
            }

            await property.destroy()
            res.json({message: "Объект удален"})
        } catch (error){
            return next(ApiError.internal(error.message))
        }
    }


    //Создание объекта
    async createProperty(req,res,next){
        try{
            const {amenities, ...propertyData} = req.body
            
            //Проверка сколько пришло файлов с изображениями
            let images = [] 
            if(req.files){
                if (Array.isArray(req.files.images)){
                    images = req.files.images
                } else if (req.files.images){
                    images = [req.files.images] 
                }
            }
            
            //Создаем объект пока без фотографии
            const property = await Property.create({
                ...propertyData,
                userId : req.user.id
            })


            if(images.length > 10){
                return next(ApiError.badRequest("Максимум 10 изображений"))
            }

            //Проверка типов файлов (допустимы jpeg)

            await Promise.all(images.map(async(image,index)=>{
                //Уникальное имя для файла с изображением и перемещение его в фолдер static
                let fileName = v4() + ".jpeg"
                const filePath = resolve(__dirname, "..", "static", fileName)

                //Сохранение файла
                await image.mv(filePath)

                //И создание записи в таблице связывающей изображение(я) с объектом
                await PropertyImage.create({
                    path : `/static/${fileName}`,
                    propertyId : property.id,
                    isMain : index === 0
                })
            }))

            //Если указаны удобства, добавляем их (специальный метод который добавляет секвалайз)
            //для связей многие ко многим
            if (amenities) {
                let amenitiesArray
                
                if (typeof amenities === 'string') {
                    try {
                        amenitiesArray = JSON.parse(amenities)
                    } catch (error) {
                        amenitiesArray = amenities.split(',').map(Number)
                    }
                } else if (Array.isArray(amenities)) {
                    amenitiesArray = amenities;
                } else {
                    amenitiesArray = []
                }
                
                if (amenitiesArray.length) {
                    await property.addAmenities(amenitiesArray)
                }
            }

            //В результате возвращаем также информацию из связанных таблиц для полной картины
            const result = await Property.findByPk(property.id,{
                include: [
                    {
                        model : Amenity, as : 'amenities'
                    },
                    {
                        model : PropertyImage
                    }
                ]
            })
            return res.json(result)

        }catch(error){
            return next(ApiError.internal(error.message))
        }

    }
 }

 const propertyController = new PropertyController()
 export default propertyController