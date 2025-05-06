import express from 'express'
import router from './routes/index.js'
import {dirname, resolve} from 'path'
import { fileURLToPath } from 'url'
import sequelize from './db.js'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import checkError from './middlewares/ErrorHandlingMiddleware.js'
import {config} from 'dotenv'
import {User,
        Property,
        Booking,
        PropertyReview,
        HostReview,
        PropertyImage,
        Wish,
        Message,
        Amenity,
        PropertyAmenities} from './models/models.js'
config()

console.log('secret key', process.env.JWT_SECRET_KEY)

const __dirname = dirname(fileURLToPath(import.meta.url))

const PORT = process.env.PORT

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(resolve(__dirname, 'static')))
app.use(fileUpload())
app.use('/api', router)
app.use(checkError)

const start = async()=>{
    try{
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, ()=>console.log('Server started on port ' + PORT))
    } catch (e){
        console.log(e)
    }
}

start()