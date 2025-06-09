import { Link, Navigate } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import AccountNavigation from "./AccountNavigation";

export default function PropertiesPage() {
    //Параметр определяющий
    //создание нового объекта или просмотр существующего
    const { action } = useParams();
    // console.log(action);

    //Состояния для формы
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [pricePerNight, setPricePerNight] = useState(0);
    const [bedrooms, setBedrooms] = useState(1);
    const [bathrooms, setBathrooms] = useState(1);
    const [MaxGuests, setMaxGuests] = useState(1);
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [photoLink, setPhotoLink] = useState("");
    const [addedPhotos, setAddedPhotos] = useState([]);
    //Отработка добавления удобств, т.к. находятся в другой таблице
    const [amenities, setAmenities] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const navigate = useNavigate();
    const [redirect, setRedirect] = useState("");
    useEffect(() => {
        axios
            .get("/amenities")
            .then((response) => setAmenities(response.data))
            .catch((error) => console.error("error fetching amenities", error));
    }, []);

    //Обработка изменения чекбоксов
    const handleAmenityChange = (amenityId) => {
        setSelectedAmenities((prev) =>
            prev.includes(amenityId)
                ? prev.filter((id) => id != amenityId)
                : [...prev, amenityId]
        );
    };

    //Запрос на отображение всех объявлений пользователя
    const [properties, setProperties] = useState([]);
    useEffect(() => {
        axios.get("/properties").then(({ data }) => {
            setProperties(data);
        });
    }, []);

    //Слабая но рабочая обработка отображения названий на русском
    const amenityTranslations = {
        Kitchen: "Кухня",
        Parking: "Парковка",
        Pool: "Бассейн",
        Gym: "Спортзал",
        "Work zone": "Рабочее место",
        TV: "Телевизор",
    };

    async function addPhotoWithLink(ev) {
        ev.preventDefault();
        const { data: filename } = await axios.post("/uploads/link", {
            link: photoLink,
        });
        setAddedPhotos((prev) => {
            return [
                ...prev,
                {
                    id: Date.now(),
                    link: filename,
                    source: "link",
                },
            ];
        });
        setPhotoLink("");
    }

    async function addPhotoFromDevice(ev) {
        try {
            const files = ev.target.files;
            if (!files || files.length === 0) {
                throw new Error("Не выбраны файлы");
            }
            const data = new FormData();
            for (let file of files) {
                data.append("photos", file);
            }
            const response = await axios.post("/uploads/device", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const newPhotos = response.data.map((filename) => ({
                id: Date.now() + Math.random(),
                link: filename,
                source: "device",
            }));
            setAddedPhotos((prev) => {
                return [...prev, ...newPhotos];
            });
        } catch (error) {
            "Ошибка загрузки:", error.response?.data?.message || error.message;
        }
    }

    async function createProperty(ev) {
        ev.preventDefault();
        try {
            await axios.post("/properties", {
                amenities: selectedAmenities,
                title,
                description,
                type,
                pricePerNight,
                bedrooms,
                bathrooms,
                MaxGuests,
                address,
                city,
                country,
                photoLinks: addedPhotos.map((p) => p.link),
                longitude: 1,
                latitude: 1,
            });
            setRedirect(true);
        } catch (error) {
            console.error(
                "Ошибка:",
                error.response?.data?.message || error.message
            );
        }
    }

    if (redirect) {
        return <Navigate to={"/profile/properties"} />;
    }

    return (
        <div>
            <AccountNavigation />
            {action !== "new" && (
                <div className="text-center">
                    list of all places
                    <br />
                    <Link
                        className="inline-flex gap-2 bg-gray-300 py-2 px-6 rounded-full"
                        to={"/profile/properties/new"}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4.5v15m7.5-7.5h-15"
                            />
                        </svg>
                        Создать объявление
                    </Link>
                    <div className="mt-4">
                        {properties.length > 0 &&
                            properties.map((property) => (
                                <div
                                    key={property.id}
                                    className="bg-gray-200 p-2 rounder-2xl"
                                >
                                    <div className="">
                                        {property.PropertyImages.map(
                                            (image) => (
                                                <img
                                                    key={image.id}
                                                    src={image.path}
                                                    alt=""
                                                    className="w-32 h-32"
                                                />
                                            )
                                        )}
                                    </div>
                                    {property.title}
                                </div>
                            ))}
                    </div>
                </div>
            )}
            {action === "new" && (
                <div className="">
                    <form onSubmit={createProperty}>
                        <h2 className="text-xl mt-4">Название</h2>
                        <input
                            type="text"
                            value={title}
                            onChange={(ev) => setTitle(ev.target.value)}
                            className=""
                            placeholder="Название, например : Уютная квартира в центре"
                        />
                        <h2 className="text-xl mt-4">Описание</h2>
                        {/* <input
                            type="text"
                            className=""
                            placeholder="Описание"
                        /> */}
                        <textarea
                            value={description}
                            onChange={(ev) => setDescription(ev.target.value)}
                        />
                        <h2 className="text-xl mt-4">Выберите тип объекта</h2>
                        <select
                            className=""
                            value={type}
                            onChange={(ev) => setType(ev.target.value)}
                        >
                            <option value=""></option>
                            <option value="apartment">Квартира</option>
                            <option value="house">Дом</option>
                            <option value="villa">Вилла</option>
                            <option value="cottage">Коттедж</option>
                            <option value="room">Комната</option>
                            <option value="studio">Студия</option>
                        </select>
                        <h2 className="text-xl mt-4">Цена</h2>
                        <input
                            value={pricePerNight}
                            onChange={(ev) => setPricePerNight(ev.target.value)}
                            type="number"
                            className=""
                            placeholder="Цена за сутки проживания, руб"
                        />
                        <h2 className="text-xl mt-4">
                            Количество спальных мест
                        </h2>
                        <input
                            value={bedrooms}
                            onChange={(ev) =>
                                setBedrooms(Number(ev.target.value))
                            }
                            type="number"
                            className=""
                            placeholder="Кол-во спальных мест"
                        />
                        <h2 className="text-xl mt-4">
                            Количество душевых комнат
                        </h2>
                        <input
                            value={bathrooms}
                            onChange={(ev) => setBathrooms(ev.target.value)}
                            type="number"
                            className=""
                            placeholder="Кол-во душевых комнат"
                        />
                        <h2 className="text-xl mt-4">
                            Макс. количество гостей
                        </h2>
                        <input
                            value={MaxGuests}
                            onChange={(ev) => setMaxGuests(ev.target.value)}
                            type="number"
                            className=""
                            placeholder="Макс. количество гостей"
                        />
                        <h2 className="text-xl mt-4">Адрес</h2>
                        <input
                            type="text"
                            value={address}
                            onChange={(ev) => setAddress(ev.target.value)}
                            className=""
                            placeholder="Адрес"
                        />
                        <h2 className="text-xl mt-4">Город</h2>
                        <input
                            type="text"
                            value={city}
                            onChange={(ev) => setCity(ev.target.value)}
                            className=""
                            placeholder="Город"
                        />
                        <h2 className="text-xl mt-4">Страна</h2>
                        <input
                            type="text"
                            className=""
                            value={country}
                            onChange={(ev) => setCountry(ev.target.value)}
                            placeholder="Страна"
                        />
                        <h2 className="text-xl mt-4">Удобства</h2>
                        <div className="flex flex-wrap gap-2">
                            {amenities.map((amenity) => (
                                <label
                                    key={amenity.id}
                                    className="flex items-center space-x-2"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedAmenities.includes(
                                            amenity.id
                                        )}
                                        onChange={() =>
                                            handleAmenityChange(amenity.id)
                                        }
                                        className=""
                                    />
                                    <span>
                                        {amenityTranslations[amenity.name] ||
                                            amenity.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                        <h2 className="text-xl mt-4">Фотографии</h2>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={photoLink}
                                onChange={(ev) => setPhotoLink(ev.target.value)}
                                placeholder="Добавить фото по ссылке (.jpg,jpeg,png)"
                            />
                            <button
                                onClick={addPhotoWithLink}
                                className="photos  border rounded-full px-4"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 4.5v15m7.5-7.5h-15"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="grid grid-cols-3 mt-3 md:grid-cols-4 lg:grid-cols-6">
                            {addedPhotos.length > 0 &&
                                addedPhotos.map((photo) => (
                                    <div key={photo.id} className="w-20 h-20">
                                        <img
                                            src={
                                                "http://localhost:5000/static/" +
                                                photo.link
                                            }
                                            alt=""
                                            className="rounded-2xl w-20 h-20"
                                        />
                                    </div>
                                ))}
                            <label className="cursor-pointer w-20 h-20 photos border bg-transparent flex flex-col justify-center items-center gap-1  rounded-full text-sm">
                                <input
                                    multiple
                                    type="file"
                                    className="hidden"
                                    onChange={addPhotoFromDevice}
                                />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                    />
                                </svg>
                                Загрузить
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="cursor-pointer login m-5"
                        >
                            Добавить объявление
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
