import sequelize from "../db.js"
import { DatabaseError, DataTypes, DATE } from "sequelize"

//Пользователи
const User = sequelize.define('user',{
    id: {type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    email : {type:DataTypes.STRING,unique:true,allowNull:false},
    password : {type:DataTypes.STRING,allowNull:false},
    firstName : {type:DataTypes.STRING,allowNull:false},
    lastName : {type:DataTypes.STRING,allowNull:false},
    phone : {type:DataTypes.STRING,allowNull:false},
    avatar : {type:DataTypes.STRING},
    role : {type:DataTypes.ENUM('user','admin'), defaultValue:'user'},
    hostRating: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
        defaultValue: null,
        validate: {
          min: 1,
          max: 5
        }
      }
})

//Объекты размещения
const Property = sequelize.define('property',{
    id: {type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    title: {type:DataTypes.STRING, allowNull:false},
    description: {type:DataTypes.STRING, allowNull:false },
    type: {type:DataTypes.ENUM('apartment','house','villa','cottage',
        'room','studio','loft','penthouse','treehouse','houseboat',
        'country_house','townhouse','chalet'), allowNull:false},
    pricePerNight: {
        type: DataTypes.DECIMAL, 
        precision: 10,          
        scale: 2,
        allowNull:false},
    bedrooms: {type:DataTypes.INTEGER, allowNull:true, defaultValue:null},
    bathrooms: {type:DataTypes.INTEGER, allowNull:true, defaultValue:null },
    MaxGuests: {type:DataTypes.INTEGER, allowNull:false},
    squareMeters: {type:DataTypes.INTEGER},
    address: {type:DataTypes.STRING, allowNull:false},
    city: {type:DataTypes.STRING, allowNull:false},
    country: {type:DataTypes.STRING,allowNull:false },
    latitude: {
        type: DataTypes.DECIMAL, 
        precision: 9,          
        scale: 6,
        allowNull:false},
    longitude: {
        type: DataTypes.DECIMAL, 
        precision: 9,          
        scale: 6,
        allowNull:false},
    isActive: {type:DataTypes.BOOLEAN,  defaultValue:true},
    rating: {
        type: DataTypes.DECIMAL, 
        precision: 3,          
        scale: 2,
        allowNull:true}
})

//Создана отдельная таблица с удобствами (wifi,kitchen,pool), т.к. если передавать массивом то нарушает
//первую НФ (атомарность атрибутов)
//А также промежуточная таблица property_amenities для связи

const Amenity = sequelize.define('amenity',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true} // "wifi", "pool" и т.д.
})

const PropertyAmenities = sequelize.define('property_amenities',{
    id: {type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true}
})

//Бронирования
const Booking = sequelize.define('booking',{
    id: {type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    checkInDate: {type:DataTypes.DATEONLY, allowNull:false},
    checkOutDate: {type:DataTypes.DATEONLY, allowNull:false},
    totalPrice: {
        type: DataTypes.DECIMAL, 
        precision: 10,          
        scale: 2,
        allowNull: false
      },
    guestsCount: {type:DataTypes.INTEGER, allowNull:false},
    status:{
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed', 'archived'),
        defaultValue:'pending'
    }
})

//Отзывы о жилье
const PropertyReview = sequelize.define('property_review',{
    id: {type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    rating: {type:DataTypes.INTEGER,validate:{min:1 ,max:5},allowNull:false, defaultValue:1},
    comment: {type:DataTypes.STRING, },
    cleanliness: {type:DataTypes.INTEGER,validate:{min:1,max:5}},
    accuracy: {type:DataTypes.INTEGER,validate:{min:1,max:5} },
    communication: {type:DataTypes.INTEGER,validate:{min:1,max:5} },
    location: {type:DataTypes.INTEGER,validate:{min:1,max:5} },
    checkIn: {type:DataTypes.INTEGER,validate:{min:1,max:5} },
})

//Отзывы о хозяевах
const HostReview = sequelize.define('host_review',{
    id: {type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    rating: {type:DataTypes.INTEGER, allowNull:false, validate:{min:1,max:5},defaultValue:1},
    comment : {type:DataTypes.STRING}
})

//Фотографии жилья
const PropertyImage = sequelize.define('property_image',{
    id: {type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    path: {type:DataTypes.STRING},
    isMain: {type:DataTypes.BOOLEAN, defaultValue:false}
})

//Избранные объекты
const Wish = sequelize.define('wish',{
    id: {type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
})

//Сообщения между пользователями
const Message = sequelize.define('message',{
    id: {type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    text: {type:DataTypes.STRING, allowNull:false},
    isRead: {type:DataTypes.BOOLEAN, defaultValue:false}
})
//Установка связей

//1.Пользователь может иметь много объектов жилья (ОДИН КО МНОГИМ)
User.hasMany(Property)
Property.belongsTo(User)

//2.Пользователь может иметь много бронирований (ОДИН КО МНОГИМ)
User.hasMany(Booking)
Booking.belongsTo(User)

//3.Объект размещения может иметь много бронирований (ОДИН КО МНОГИМ)
Property.hasMany(Booking,{foreignKey:'propertyId'})
Booking.belongsTo(Property,{foreignKey:'propertyId'})

//4.Объект жилья может иметь много отзывов (ОДИН КО МНОГИМ)
Property.hasMany(PropertyReview)
PropertyReview.belongsTo(Property)

//5.Пользователь может оставить много отзывов о жилье (ОДИН КО МНОГИМ)
User.hasMany(PropertyReview)
PropertyReview.belongsTo(User)


//7. Пользователь может оставить много отзывов о хозяине
//при повторном бронировании (ОДИН КО МНОГИМ)
User.hasMany(HostReview)
HostReview.belongsTo(User)

//8. Объект жилья может иметь много фотографий (ОДИН КО МНОГИМ)
Property.hasMany(PropertyImage)
PropertyImage.belongsTo(Property)

//9. Пользователь может иметь много избранных объектов (ОДИН КО МНОГИМ)
User.hasMany(Wish)
Wish.belongsTo(User)

//10. Объект жилья может быть в избранном у множества пользователей (ОДИН КО МНОГИМ)
Property.hasMany(Wish)
Wish.belongsTo(Property)

// 11. Сообщения между пользователями (ОДИН КО МНОГИМ как 
//отправитель и ОДИН ко многим как получатель)
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

//12. Одно бронирование содержит максимум 1 отзыв о жилье (или не содержит) (ОДИН К ОДНОМУ)
Booking.hasOne(PropertyReview)
PropertyReview.belongsTo(Booking)

//13. Одно бронирование содержит максимум 1 отзыв о хозяине (или не содержит) (ОДИН К ОДНОМУ)
//Подразумевается что у объекта может поменяться хозяин
Booking.hasOne(HostReview)
HostReview.belongsTo(Booking)

//14. Один объект может иметь много удобств, 
//одно удобство может принадлежать множеству объектов, то есть его могут иметь и дом, и квартира, и вилла
Property.belongsToMany(Amenity,{through:PropertyAmenities})
Amenity.belongsToMany(Property,{through:PropertyAmenities})



export {
        User,
        Property,
        Booking,
        PropertyReview,
        HostReview,
        PropertyImage,
        Wish,
        Message,
        Amenity,
        PropertyAmenities
}

