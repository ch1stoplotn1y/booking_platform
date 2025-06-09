import imageDownloader from "image-downloader";
import { fileURLToPath } from "url";
import { v4 } from "uuid";
import { dirname } from "path";
import { resolve } from "path";
import ApiError from "../error/ApiError.js";
import multer from "multer";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
class UploadController {
    //Загрузка по ссылке
    async uploadByLink(req, res, next) {
        try {
            const fileName = `Photo_${v4()}.jpeg`;
            const filePath = resolve(__dirname, "..", "static", fileName);
            const { link } = req.body;
            await imageDownloader.image({
                url: link,
                dest: filePath,
            });
            res.json(fileName);
        } catch (error) {
            return error.message;
        }
    }

    //Загрузка с устройства
    async uploadFromDevice(req, res, next) {
        try {
            if (!req.files || !req.files.photos) {
                return next(ApiError.badRequest("Не выбраны файлы"));
            }
            let filenames = [];
            const files = Array.isArray(req.files.photos)
                ? req.files.photos
                : [req.files.photos];

            for (const file of files) {
                const fileName = `Photo_${v4()}.jpeg`;
                const filePath = resolve(__dirname, "..", "static", fileName);
                await file.mv(filePath);
                filenames.push(fileName);
            }
            res.json(filenames);
        } catch (error) {
            return error.message;
        }
    }
}

const uploadController = new UploadController();
export default uploadController;
