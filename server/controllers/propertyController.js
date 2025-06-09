import ApiError from "../error/ApiError.js";
import {
    Property,
    Amenity,
    PropertyAmenities,
    Wish,
    PropertyImage,
    Booking,
    PropertyReview,
    User,
} from "../models/models.js";
import { Op } from "sequelize";
import path from "path";
import { fileURLToPath } from "url";
import { v4 } from "uuid";
import { dirname } from "path";
import { resolve } from "path";
import imageDownloader from "image-downloader";
import { unlinkSync } from "fs";

//Для загрузки изображений в static

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Для парсинга поля amenities при передаче через form-data
//В виде key : amenities, value : [1,2,3], а не отдельно
//Для удобства отправки запросов
function parseAmenities(amenities) {
    if (!amenities) return [];

    if (Array.isArray(amenities)) {
        return amenities.map(Number);
    }

    if (typeof amenities === "string") {
        try {
            return JSON.parse(amenities);
        } catch (error) {
            return amenities.split(",").map(Number);
        }
    }

    return [];
}

//CRUD для объектов недвижимости
class PropertyController {
    async getAllProperties(req, res, next) {
        try {
            const {
                city,
                minPrice,
                maxPrice,
                maxGuests,
                amenities,
                type,
                limit,
                offset,
            } = req.query;

            const where = {};
            const include = [
                {
                    model: PropertyImage,
                    attributes: ["id", "path", "isMain"],
                },
                {
                    model: PropertyReview,
                    include: [
                        {
                            model: User,
                            attributes: [
                                "id",
                                "firstName",
                                "lastName",
                                "avatar",
                            ],
                        },
                        {
                            model: Booking,
                            attributes: ["id", "checkInDate", "checkOutDate"],
                        },
                    ],
                },
            ];

            // Фильтр по городу
            if (city) where.city = city;

            if (type) where.type = type;

            // Фильтр по цене
            if (minPrice || maxPrice) {
                where.pricePerNight = {};
                if (minPrice) where.pricePerNight[Op.gte] = minPrice;
                if (maxPrice) where.pricePerNight[Op.lte] = maxPrice;
            }

            // Фильтр по количеству гостей
            if (maxGuests) where.MaxGuests = { [Op.gte]: maxGuests };

            // Фильтр по удобствам
            if (amenities) {
                const amenitiesArray = parseAmenities(amenities);
                if (amenitiesArray.length > 0) {
                    include.push({
                        model: Amenity,
                        where: { id: { [Op.in]: amenitiesArray } },
                        attributes: [],
                        through: { attributes: [] },
                    });
                }
            }

            const properties = await Property.findAndCountAll({
                where,
                include,
                distinct: true, // Важно для правильного подсчета при include с фильтрацией
                limit: limit ? parseInt(limit) : undefined,
                offset: offset ? parseInt(offset) : undefined,
            });

            return res.json(properties);
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }

    //Получение объекта по айди
    async getProperty(req, res, next) {
        try {
            const { id } = req.params;
            const property = await Property.findByPk(id, {
                include: [
                    {
                        model: Amenity,
                        attributes: ["id", "name"],
                        through: { attributes: [] },
                    },
                    {
                        model: PropertyImage,
                        attributes: ["id", "path", "isMain"],
                    },

                    {
                        model: PropertyReview,
                        include: [
                            {
                                model: User,
                                attributes: [
                                    "id",
                                    "firstName",
                                    "lastName",
                                    "avatar",
                                ],
                            },
                            {
                                model: Booking,
                                attributes: [
                                    "id",
                                    "checkInDate",
                                    "checkOutDate",
                                ],
                            },
                        ],
                    },
                ],
            });

            if (!property) {
                return next(ApiError.badRequest("Объект не найден"));
            }
            return res.json(property);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }

    async updateProperty(req, res, next) {
        try {
            const { id } = req.params;
            let { amenities, photoLinks, ...propertyData } = req.body;
            console.log(photoLinks);

            // 2. Получение текущего объекта с фото
            const property = await Property.findOne({
                where: { id, userId: req.user.id },
                include: [PropertyImage],
            });

            if (!property) {
                return next(
                    ApiError.badRequest("Нельзя изменять чужой объект")
                );
            }

            // 3. Обновлениеданных
            await property.update(propertyData);

            // 4. Обновление удобств
            if (amenities) {
                await property.setAmenities(amenities);
            }

            // 5. Обработка фотографий
            const currentImages = property.property_images || [];

            const currentNormalizedPaths = currentImages.map((img) =>
                img.path.replace("/static/", "")
            );

            // Фото для удаления (есть в БД, но нет в запросе)
            const imagesToRemove = currentImages.filter(
                (img) => !photoLinks.includes(img.path.replace("/static/", ""))
            );

            // Фото для добавления (есть в запросе, но нет в БД)
            const imagesToAdd = photoLinks
                .filter((link) => !currentNormalizedPaths.includes(link))
                .filter(
                    (link) =>
                        !currentImages.some(
                            (img) => img.path === `/static/${link}`
                        )
                );

            // Удаление
            if (imagesToRemove.length > 0) {
                await PropertyImage.destroy({
                    where: { id: imagesToRemove.map((img) => img.id) },
                });
            }

            // Добавление (сохраняем с /static/)
            if (imagesToAdd.length > 0) {
                await PropertyImage.bulkCreate(
                    imagesToAdd.map((link) => ({
                        path: `/static/${link}`,
                        propertyId: id,
                        isMain: false,
                    }))
                );
            }

            if (photoLinks.length > 0) {
                const mainImagePath = `/static/${photoLinks[0]}`;

                //Сначала делаем все не главными
                await PropertyImage.update(
                    { isMain: false },
                    { where: { propertyId: id } }
                );

                // Потом нужное главным (FIXMEEEEEEE)
                await PropertyImage.update(
                    { isMain: true },
                    { where: { propertyId: id, path: mainImagePath } }
                );
            }

            // 6. Возвращаем обновленный объект
            const updatedProperty = await Property.findByPk(id, {
                include: [Amenity, PropertyImage],
            });

            return res.json(updatedProperty);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }

    //Удаление объекта
    async deleteProperty(req, res, next) {
        try {
            const { id } = req.params;

            const property = await Property.findOne({
                where: { id, userId: req.user.id },
            });

            if (!property) {
                return next(
                    ApiError.badRequest("Вы не можете удалить чужой объект")
                );
            }

            await property.destroy();
            res.json({ message: "Объект удален" });
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }

    //Создание объекта
    async createProperty(req, res, next) {
        try {
            const { amenities, photoLinks, ...propertyData } = req.body;
            console.log(req.user.id);
            console.log("Extracted propertyData:", propertyData);
            console.log("photoLinks:", photoLinks);

            //Создаем объект без фото (другая таблица)
            const property = await Property.create({
                ...propertyData,
                userId: req.user.id,
            });

            await Promise.all(
                photoLinks.map((link, index) =>
                    PropertyImage.create({
                        path: `/static/${link}`,
                        propertyId: property.id,
                        isMain: index === 0,
                    })
                )
            );

            //Если указаны удобства, добавляем их (специальный метод который добавляет секвалайз)
            //для связей многие ко многим
            if (amenities) {
                let amenitiesArray;

                if (typeof amenities === "string") {
                    try {
                        amenitiesArray = JSON.parse(amenities);
                    } catch (error) {
                        amenitiesArray = amenities.split(",").map(Number);
                    }
                } else if (Array.isArray(amenities)) {
                    amenitiesArray = amenities;
                } else {
                    amenitiesArray = [];
                }

                if (amenitiesArray.length) {
                    await property.addAmenities(amenitiesArray);
                }
            }

            //В результате возвращаем также информацию из связанных таблиц для полной картины
            const result = await Property.findByPk(property.id, {
                include: [
                    {
                        model: Amenity,
                        as: "amenities",
                    },
                    {
                        model: PropertyImage,
                    },
                ],
            });
            return res.json(result);
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
}

const propertyController = new PropertyController();
export default propertyController;
