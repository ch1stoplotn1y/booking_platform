import express from "express";
import router from "./routes/index.js";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import sequelize from "./db.js";
import cors from "cors";
import fileUpload from "express-fileupload";
import checkError from "./middlewares/ErrorHandlingMiddleware.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import {
    User,
    Property,
    Booking,
    PropertyReview,
    HostReview,
    PropertyImage,
    Wish,
    Message,
    Amenity,
    PropertyAmenities,
} from "./models/models.js";
config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT;

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/static", express.static(resolve(__dirname, "static")));
app.use(fileUpload());
app.use("/api", router);
// app.use(checkError);

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log("Server started on port " + PORT));
    } catch (e) {
        console.log(e);
    }
};

start();
