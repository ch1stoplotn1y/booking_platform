import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AccountNavigation from "./AccountNavigation";
import { Navigate } from "react-router-dom";
import { amenityTranslations } from "../utils/utils";
export default function AddPropertyForm() {
    let { id } = useParams();
    //Все состояния для полей формы
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [pricePerNight, setPricePerNight] = useState(0);
    const [bedrooms, setBedrooms] = useState(1);
    const [bathrooms, setBathrooms] = useState(1);
    const [squareMeters, setSquareMeters] = useState(0);
    const [MaxGuests, setMaxGuests] = useState(1);
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [photoLink, setPhotoLink] = useState("");
    const [addedPhotos, setAddedPhotos] = useState([]);

    //Отработка добавления удобств, т.к. находятся в другой таблице
    const [amenities, setAmenities] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);

    //Состояние для направления на список всех объявлений юзера
    const [redirect, setRedirect] = useState("");
    //Запрос на все удобства из другой таблицы
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

    //Загрузка фото по ссылке
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

    //Загрузка  фото с устройства
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

    //Удаление фотографии
    const removePhoto = (photoId) => {
        setAddedPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
    };

    function putAsMainPhoto(photoId) {
        setAddedPhotos((prev) => {
            // Находим отмеченное звездочкой фото
            const photoIndex = prev.findIndex((photo) => photo.id === photoId);
            if (photoIndex === -1) return prev; //Если не изменилось оставляем

            // Новый массив где отмеченное звездой фото будет первым
            const newPhotos = [
                prev[photoIndex], // Выбранное фото
                ...prev.slice(0, photoIndex), // Слайс массива со всеми фото до выбранного
                ...prev.slice(photoIndex + 1), // Слайс массива со всеми фото после выбранного
            ];

            return newPhotos;
        });
    }

    //Запрос на создание объявления
    async function createProperty(ev) {
        ev.preventDefault();
        const photoLinks = addedPhotos.map((p) => p.link);
        if (id) {
            try {
                await axios.put(`/properties/${id}`, {
                    amenities: selectedAmenities,
                    title,
                    description,
                    type,
                    pricePerNight,
                    bedrooms,
                    bathrooms,
                    MaxGuests,
                    squareMeters,
                    address,
                    city,
                    country,
                    photoLinks,
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
        } else {
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
                    squareMeters,
                    address,
                    city,
                    country,
                    photoLinks,
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
    }

    //Отработка перехода на страницу конкретного объявления
    useEffect(() => {
        if (!id) {
            return;
        }
        axios
            .get(`/properties/${id}`)
            .then((res) => {
                const { data } = res;
                setTitle(data.title);
                setDescription(data.description);
                setType(data.type);
                setPricePerNight(data.pricePerNight);
                setBedrooms(data.bedrooms);
                setBathrooms(data.bathrooms);
                setSquareMeters(data.squareMeters);
                setMaxGuests(data.MaxGuests);
                setAddress(data.address);
                setCity(data.city);
                setCountry(data.country);
                setSelectedAmenities(
                    data.amenities
                        ? data.amenities.map((amenity) => amenity.id)
                        : []
                );
                //Преобразование ссылок (путей) обратно в формат addedPhotos
                if (data.property_images) {
                    const loadedPhotos = data.property_images.map((image) => ({
                        id: image.id,
                        //Чтобы не конфликтовало с путем который формируется в форме
                        link: image.path.replace("/static/", ""),
                        source: "loaded",
                    }));
                    setAddedPhotos(loadedPhotos);
                }
            })
            .catch((error) => {
                console.error("Ошибка загрузки property:", error);
            });
    }, [id]);

    //Направление на список всех объявлений при добавлении / изменении
    if (redirect) {
        return <Navigate to={"/profile/properties"} />;
    }
    console.log(addedPhotos[0]);
    return (
        <div className="mx-auto max-w-xl">
            <AccountNavigation />
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
                <textarea
                    value={description}
                    onChange={(ev) => setDescription(ev.target.value)}
                />
                <h2 className="text-xl mt-4">Выберите тип объекта</h2>
                <select
                    className="border p-1 rounded-2xl text-center"
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
                    <option value="penthouse">Пентхаус</option>
                </select>
                <h2 className="text-xl mt-4">Цена за сутки проживания</h2>
                <input
                    value={pricePerNight}
                    onChange={(ev) => setPricePerNight(Number(ev.target.value))}
                    type="number"
                    className=""
                    placeholder="Цена за сутки проживания, руб"
                />
                <h2 className="text-xl mt-4">Количество спальных мест</h2>
                <input
                    value={bedrooms}
                    onChange={(ev) => setBedrooms(Number(ev.target.value))}
                    type="number"
                    className=""
                    placeholder="Кол-во спальных мест"
                />
                <h2 className="text-xl mt-4">Количество душевых комнат</h2>
                <input
                    value={bathrooms}
                    onChange={(ev) => setBathrooms(Number(ev.target.value))}
                    type="number"
                    className=""
                    placeholder="Кол-во душевых комнат"
                />
                <h2 className="text-xl mt-4">Общая площадь, м.кв.</h2>
                <input
                    value={squareMeters}
                    onChange={(ev) => setSquareMeters(Number(ev.target.value))}
                    type="number"
                    className=""
                    placeholder="Общая площадь, м.кв."
                />
                <h2 className="text-xl mt-4">Макс. количество гостей</h2>
                <input
                    value={MaxGuests}
                    onChange={(ev) => setMaxGuests(Number(ev.target.value))}
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
                                checked={selectedAmenities.includes(amenity.id)}
                                onChange={() => handleAmenityChange(amenity.id)}
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
                <div className="flex gap-2">
                    {addedPhotos.length > 0 &&
                        addedPhotos.map((photo, index) => (
                            <div
                                key={photo.id}
                                className="w-40 h-40 relative group"
                            >
                                <img
                                    src={
                                        "http://localhost:5000/static/" +
                                        photo.link
                                    }
                                    alt=""
                                    className="rounded-2xl object-cover w-full h-full"
                                />
                                <button
                                    type="button"
                                    className="text-white absolute bottom-1 right-1 p-1 !bg-transparent hover:!bg-red-500/30 rounded-full transition-colors"
                                    onClick={() => removePhoto(photo.id)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="size-6"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => putAsMainPhoto(photo.id)}
                                    className="text-yellow-400 absolute top-1 left-1 p-1 !bg-transparent hover:!bg-red-500/30 rounded-full transition-colors"
                                >
                                    {photo.link === addedPhotos[0].link && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="size-6"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                    {photo.link !== addedPhotos[0].link && (
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
                                                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        ))}
                    <label className="cursor-pointer p-3 photos border border-gray-200 bg-transparent flex flex-col justify-center items-center gap-1  rounded-full text-sm">
                        <input
                            multiple
                            type="file"
                            className="hidden p-2"
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
                <button type="submit" className="cursor-pointer login mt-12">
                    {id ? "Сохранить изменения" : "Добавить объявление"}
                </button>
            </form>
        </div>
    );
}
