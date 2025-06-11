import { Link, useParams, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import axios from "axios";
import { differenceInCalendarDays } from "date-fns";
import {
    typeTranslations,
    amenityTranslations,
    amenityIcons,
    getBedWord,
    getGuestsWord,
    getBathWord,
    getReviewWord,
    getDayWord,
} from "../utils/utils.jsx";
import * as Icon from "../icons/iconsStorage.jsx";
import { UserContext } from "../contexts/UserContext.jsx";

export default function SinglePlacePage() {
    //id объявления
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [host, setHost] = useState(null);

    //id текущего пользователя
    const { user } = useContext(UserContext);

    //Для формы брованирования
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guestsCount, setGuestsCount] = useState(1);

    //Навигация после бронирования
    const [redirect, setRedirect] = useState("");
    //Расчет стоимости бронирования
    let daysCount = 0;
    let totalPrice = 0;
    if (checkIn && checkOut) {
        daysCount = differenceInCalendarDays(checkOut, checkIn);
        totalPrice = daysCount * property.pricePerNight;
    }

    //ФИО в форме бронирования
    const [bookerFullName, setBookerFullName] = useState("");

    //Отработка состояний для открытия всех фото (изначально 3)
    const [displayAllPhotos, setDisplayAllPhotos] = useState(false);
    useEffect(() => {
        if (!id) {
            return;
        }
        axios
            .get(`/properties/${id}`)
            .then((res) => {
                setProperty(res.data);
            })
            .catch((error) => {
                console.error("Ошибка загрузки property:", error);
            });
    }, [id]);
    //Информация о хосте объекта
    //(при изменении id объекта хук будет
    //забирать информацию о новом хосте)

    useEffect(() => {
        if (!property || host) return;
        axios
            .get(`/users/${property.userId}`)
            .then((res) => {
                setHost(res.data);
            })
            .catch((error) => {
                console.error("Ошибка загрузки хоста:", error.message);
            });
    }, [property?.userId]);

    //Чтобы не было ошибки при первом рендере (может не отправлять запрос)
    //т.к. стейт - null
    if (!property || !host) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    async function createBooking(ev) {
        ev.preventDefault();
        try {
            const res = await axios.post("/bookings", {
                checkInDate: checkIn,
                checkOutDate: checkOut,
                totalPrice,
                guestsCount,
                propertyId: property.id,
                userId: user.id,
            });
            const bookingId = res.data.id;
            setRedirect(`/profile/bookings/${bookingId}`);
        } catch (error) {
            console.log(error);
        }
    }

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    if (displayAllPhotos) {
        return (
            <div className="bg-gray-200 min-h-screen absolute inset-0">
                <div className="bg-gray-200 p-10 grid gap-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-4xl">Все фотографии</h1>
                            <button
                                type="button"
                                onClick={() => setDisplayAllPhotos(false)}
                                className="cursor-pointer flex gap-3 rounded-2xl p-3 bg-green-300 hover:bg-green-400 transition-colors"
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
                                        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
                                </svg>
                                Вернуться к объявлению
                            </button>
                        </div>
                        <div className="grid gap-8">
                            {property.property_images.length > 0 &&
                                property.property_images.map((p) => (
                                    <div
                                        key={p.id}
                                        className="flex justify-center"
                                    >
                                        <img
                                            src={`http://localhost:5000${p.path}`}
                                            alt=""
                                            className="rounded-2xl w-full h-full object-cover" /* Ограничиваем максимальную ширину */
                                        />
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-10 mx-auto max-w-4xl">
            <div className="">
                <h1 className="text-3xl font-bold">{property.title}</h1>
                <div className="flex mt-4">
                    <p className="font-semibold mx-1 text-xl">Адрес :</p>
                    <a
                        target="_blank"
                        href={`https://maps.google.com/?q=${property.address}`}
                        className="flex items-center font-semibold text-xl underline"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-5 mt-1"
                        >
                            <path
                                fillRule="evenodd"
                                d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        г. {property.city}, {property.address}
                    </a>
                </div>
            </div>

            <div className="mt-8 relative">
                <div className="grid gap-1 grid-cols-[2fr_1fr]">
                    <div className="">
                        {property.property_images[0] && (
                            <div className="">
                                <img
                                    src={`http://localhost:5000${
                                        property.property_images.find(
                                            (img) => img.isMain
                                        ).path
                                    }`}
                                    alt=""
                                    className="aspect-square object-cover rounded-2xl"
                                />
                            </div>
                        )}
                    </div>
                    <div className="grid">
                        {property.property_images[1] && (
                            <img
                                src={`http://localhost:5000${property.property_images[1].path}`}
                                alt=""
                                className="aspect-square object-cover rounded-2xl"
                            />
                        )}
                        <div className="overflow-hidden">
                            {property.property_images[2] && (
                                <img
                                    src={`http://localhost:5000${property.property_images[2].path}`}
                                    alt=""
                                    className="aspect-square object-cover relative top-1 rounded-2xl"
                                />
                            )}
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setDisplayAllPhotos(true)}
                    className="cursor-pointer flex gap-1 absolute bottom-3 right-3 bg-white p-1 rounded-xl"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                    >
                        <path
                            fillRule="evenodd"
                            d="M12 2.25a.75.75 0 0 1 .75.75v16.19l6.22-6.22a.75.75 0 1 1 1.06 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 1 1 1.06-1.06l6.22 6.22V3a.75.75 0 0 1 .75-.75Z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Показать все фото
                </button>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-semibold">
                    {typeTranslations[property.type]}, {property.city},{" "}
                    {property.country}
                </h2>
            </div>

            <div className="flex justify-between mt-8 bg-gray-50 rounded-2xl w-fit p-4">
                <div className="flex border-r border-gray-300 px-4 gap-2 font-medium text-lg">
                    <p className="">{property.bedrooms}</p>
                    <p className="">{getBedWord(property.bedrooms)}</p>
                </div>
                <div className="flex border-r border-gray-300 px-4 gap-2 text-lg font-medium">
                    <p className="">{property.bathrooms}</p>
                    <p className="">{getBathWord(property.bathrooms)}</p>
                </div>
                <div className="flex border-r border-gray-300 px-4 gap-2 text-lg font-medium">
                    <p className="">Площадь:</p>
                    <p className="">{property.squareMeters}м²</p>
                </div>
                <div className="flex px-4 gap-2 text-lg font-medium">
                    <p className="">{property.MaxGuests}</p>
                    <p className="">{getGuestsWord(property.MaxGuests)}</p>
                </div>
            </div>

            <div className="flex justify-between mt-8 bg-gray-50 rounded-2xl w-fit p-4">
                {property.rating !== null ? (
                    <div className="flex border-r items-center border-gray-300 px-4 gap-2 font-medium text-lg">
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
                        <p className="">
                            По мнению гостей:{" "}
                            {typeof property.rating === "number"
                                ? property.rating.toFixed(1)
                                : parseFloat(property.rating).toFixed(1)}
                        </p>
                    </div>
                ) : (
                    <div className="flex border-r items-center border-gray-300 px-4 gap-2 font-medium text-lg">
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
                        <p className="">Оценка еще не выставлена</p>
                    </div>
                )}

                {property.property_reviews.length > 0 ? (
                    <div className="flex  items-center border-gray-300 px-4 gap-2 font-medium text-lg">
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
                                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                            />
                        </svg>
                        <div className="flex gap-2">
                            <p>{property.property_reviews.length} </p>
                            <p>
                                {getReviewWord(
                                    property.property_reviews.length
                                )}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex px-4 gap-2 font-medium text-lg items-center">
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
                                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                            />
                        </svg>
                        <p className="">Отзывов еще нет</p>
                    </div>
                )}
            </div>
            <div className="mt-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold border-b">
                        Об этом жилье
                    </h2>
                    <p className="text-lg leading-relaxed text-justify">
                        {property.description}
                    </p>
                </div>
            </div>

            <div className="mt-4">
                <h2 className="text-2xl font-bold border-b py-2">
                    Удобства для вас
                </h2>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(400px,_1fr)_350px] md:grid-cols-[minmax(400px,_1fr)_350px]">
                <div className="grid grid-cols-[repeat(auto-fill, minmax(250px, 1fr))] gap-3">
                    {property.amenities.map((amenity) => (
                        <div
                            key={amenity.id}
                            className="flex gap-3 items-center"
                        >
                            <div className="">{amenityIcons[amenity.name]}</div>
                            <div className="font-semibold text-xl">
                                {amenityTranslations[amenity.name] ||
                                    amenity.name}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white py-2 rounded-2xl border border-gray-200 shadow w-full h-fit p-2">
                    <div className="text-center text-xl">
                        Цена : {property.pricePerNight}₽ / ночь
                    </div>
                    <div className="border rounded-2xl mt-4">
                        <div className="flex">
                            <div className="p-4">
                                <label className="text-lg">
                                    Дата заселения
                                </label>
                                <input
                                    type="date"
                                    className="p-2"
                                    value={checkIn}
                                    onChange={(ev) =>
                                        setCheckIn(ev.target.value)
                                    }
                                />
                            </div>
                            <div className="p-4 border-l">
                                <label className="text-lg">Дата отъезда</label>
                                <input
                                    type="date"
                                    className="p-2"
                                    value={checkOut}
                                    onChange={(ev) =>
                                        setCheckOut(ev.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="p-4 border-t text-center">
                            <label className="text-lg">Количество гостей</label>
                            <input
                                type="number"
                                className=""
                                value={guestsCount}
                                onChange={(ev) =>
                                    setGuestsCount(ev.target.value)
                                }
                            />
                        </div>
                        {daysCount > 0 && (
                            <div className="flex gap-2 justify-center text-lg font-bold">
                                Итоговая цена за {daysCount}{" "}
                                {getDayWord(daysCount)}: {totalPrice}₽
                            </div>
                        )}
                        <div className="p-4 border-t text-center">
                            <label className="text-lg">Ваше полное имя</label>
                            <input
                                type="text"
                                className=""
                                value={bookerFullName}
                                onChange={(ev) =>
                                    setBookerFullName(ev.target.value)
                                }
                            />
                        </div>
                        <button
                            type="button"
                            onClick={createBooking}
                            className="mx-auto block w-auto
                            rounded-2xl p-4 !bg-green-300 hover:!bg-green-400
                            transition-colors text-lg font-medium shadow-md my-5"
                        >
                            Забронировать
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-8 border border-gray-300 rounded-2xl w-fit">
                <div className="flex gap-6 items-center p-5">
                    <div className="w-20 h-20">
                        <Link className="">
                            <img
                                src={
                                    host.avatar
                                        ? `http://localhost:5000${host.avatar}`
                                        : "http://localhost:5000/static/default_avatar.jpg"
                                }
                                alt="host photo"
                                className="w-full h-full rounded-full border border-gray-200"
                            />
                        </Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="font-semibold text-lg">
                            Хозяин: {host.firstName}
                        </p>
                        {parseFloat(host.hostRating) > 0 ? (
                            <div className="text-lg flex gap-2 items-center">
                                <Icon.StarIcon className="" />
                                <div className="">
                                    {parseFloat(host.hostRating)}
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-400 text-sm flex gap-2 items-center">
                                <Icon.StarOffIcon />
                                <div className="">
                                    У этого хозяина еще нет рейтинга
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {property.property_reviews[0]?.rating &&
            property.property_reviews[0]?.cleanliness &&
            property.property_reviews[0]?.accuracy &&
            property.property_reviews[0]?.communication &&
            property.property_reviews[0]?.location &&
            property.property_reviews[0]?.checkIn ? (
                <div className="border mt-8 grid grid-cols-6 rounded-2xl border-gray-300 font-semibold">
                    <div className="border-r border-gray-200 flex flex-col gap-4 p-4">
                        <div className="">Общая оценка</div>
                        <div className="flex gap-6 items-center">
                            <Icon.StarIcon />
                            <div className="">
                                {parseFloat(property.rating).toFixed(1)}
                            </div>
                        </div>
                    </div>
                    <div className="border-r border-gray-200 flex flex-col gap-4 p-4">
                        <div className="">Чистота</div>
                        <div className="flex gap-6 items-center">
                            <Icon.CleanlinessIcon />
                            <div className="">
                                {property.property_reviews[0].cleanliness}
                            </div>
                        </div>
                    </div>
                    <div className="border-r border-gray-200 flex flex-col gap-4 p-4">
                        <div className="">Точность</div>
                        <div className="flex gap-6 items-center">
                            <Icon.AccuracyIcon />
                            <div className="">
                                {property.property_reviews[0].accuracy}
                            </div>
                        </div>
                    </div>
                    <div className="border-r border-gray-200 flex flex-col gap-4 p-4">
                        <div className="">Коммуникация</div>
                        <div className="flex gap-6 items-center">
                            <Icon.CommunicationIcon />
                            <div className="">
                                {property.property_reviews[0].communication}
                            </div>
                        </div>
                    </div>
                    <div className="border-r border-gray-200 flex flex-col gap-4 p-4">
                        <div className="">Локация</div>
                        <div className="flex gap-6 items-center">
                            <Icon.LocationIcon />
                            <div className="">
                                {property.property_reviews[0].location}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 p-4">
                        <div className="">Заселение</div>
                        <div className="flex gap-6 items-center">
                            <Icon.CheckInIcon />
                            <div className="">
                                {property.property_reviews[0].checkIn}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="border-1 mt-8 p-3 grid grid-cols-6 rounded-2xl border-yellow-700">
                    <div className="border-r border-gray-200 flex flex-col gap-4 p-3">
                        <div className="font-semibold">Общая оценка</div>
                        <div className="flex gap-1 items-center">
                            <Icon.StarIcon />
                            <div className="text-gray-500 text-xs">
                                Оценки пока нет
                            </div>
                        </div>
                    </div>
                    <div className="border-r border-gray-200 flex flex-col gap-4 p-3">
                        <div className="font-semibold">Чистота</div>
                        <div className="flex gap-1 items-center">
                            <Icon.CleanlinessIcon />
                            <div className="text-gray-500 text-xs">
                                Оценки пока нет
                            </div>
                        </div>
                    </div>
                    <div className="border-r border-gray-200 flex flex-col gap-4 p-3">
                        <div className="font-semibold">Точность</div>
                        <div className="flex gap-1 items-center">
                            <Icon.AccuracyIcon />
                            <div className="text-gray-500 text-xs">
                                Оценки пока нет
                            </div>
                        </div>
                    </div>
                    <div className="border-r border-gray-200 flex flex-col gap-4 p-3">
                        <div className="font-semibold">Коммуникация</div>
                        <div className="flex gap-1 items-center">
                            <Icon.CommunicationIcon />
                            <div className="text-gray-500 text-xs">
                                Оценки пока нет
                            </div>
                        </div>
                    </div>
                    <div className="border-r border-gray-200 flex flex-col gap-4 p-3">
                        <div className="font-semibold">Локация</div>
                        <div className="flex gap-1 items-center">
                            <Icon.LocationIcon />
                            <div className="text-gray-500 text-xs">
                                Оценки пока нет
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 p-3">
                        <div className="font-semibold">Заселение</div>
                        <div className="flex gap-1 items-center">
                            <Icon.CheckInIcon />
                            <div className="text-gray-500 text-xs">
                                Оценки пока нет
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-3 gap-6 mt-8 border border-gray-300 rounded-2xl p-4 font-semibold text-lg">
                {property.property_reviews.length > 0 &&
                    property.property_reviews.map((review) => (
                        <div
                            key={review.id}
                            className="flex flex-col gap-2 border border-gray-200 rounded-xl p-4"
                        >
                            <div className="flex gap-2 items-center p-3">
                                <img
                                    src={
                                        review.user.avatar
                                            ? `http://localhost:5000${review.user.avatar}`
                                            : `http://localhost:5000/static/default_avatar.jpg`
                                    }
                                    alt=""
                                    className="w-10 h-10 rounded-full"
                                />
                                <span className="">
                                    {review.user.firstName}: {review.rating}
                                </span>
                            </div>
                            <div className="border border-gray-100 rounded-2xl p-3">
                                {review.comment}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
