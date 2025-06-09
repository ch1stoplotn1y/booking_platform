import { Amenity } from "../models/models.js";
import ApiError from "../error/ApiError.js";

//Админский CRUD для атрибута amenities (удобства) в таблице Property
class AmenityController {
  async getAllAmenities(req, res, next) {
    try {
      const amenities = await Amenity.findAll();
      return res.json(amenities);
    } catch (error) {
      return next(ApiError.internal(error.message));
    }
  }

  async createAmenity(req, res, next) {
    try {
      const { name } = req.body;

      const amenity = await Amenity.create({ name });
      return res.json({ amenity: amenity, message: "Удобство создано" });
    } catch (error) {
      return next(ApiError.internal(error.message));
    }
  }
}

const amenityController = new AmenityController();
export default amenityController;
