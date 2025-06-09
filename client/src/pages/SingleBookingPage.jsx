import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as Icon from "../icons/Icons";
import AccountNavigation from "./AccountNavigation";
import ReviewPopup from "../components/ReviewPopup";
import {
    typeTranslations,
    getBedWord,
    getBathWord,
    getDayWord,
    getGuestsWord,
    amenityIcons,
    amenityTranslations,
} from "../utils/utils";
export default function SingleBookingPage() {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [host, setHost] = useState(null);
    const [displayAllPhotos, setDisplayAllPhotos] = useState(false);

    const [showPropertyReviewPopup, setShowPropertyReviewPopup] =
        useState(false);
    const [showHostReviewPopup, setShowHostReviewPopup] = useState(false);
    const [reviewSubmitted, setReviewSubmitted] = useState(false);

    useEffect(() => {
        if (!id) return;
        try {
            axios.get(`/bookings/${id}`).then((res) => {
                setBooking(res.data);
            });
        } catch (error) {
            console.log(error.message);
        }
    }, [id]);

    useEffect(() => {
        if (!booking?.property?.userId || host) return;
        axios
            .get(`/users/${booking.property.userId}`)
            .then((res) => {
                setHost(res.data);
            })
            .catch((error) => {
                console.error("Ошибка загрузки хоста:", error.message);
            });
    }, [booking?.property?.userId]);

    if (!booking) {
        return;
    }

    async function cancelBooking(ev) {
        ev.PreventDefault();
        try {
            await axios.post("/bookings/cancel", id);
        } catch (error) {
            error.message;
        }
    }

    const handleReviewSuccess = () => {
        setReviewSubmitted(true);
    };

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
                                Вернуться к бронированию
                            </button>
                        </div>
                        <div className="grid gap-8">
                            {booking.property.property_images.length > 0 &&
                                booking.property.property_images.map((p) => (
                                    <div
                                        key={p.id}
                                        className="flex justify-center"
                                    >
                                        <img
                                            src={`http://localhost:5000${p.path}`}
                                            alt=""
                                            className="rounded-2xl w-full h-full object-cover"
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
        <div className="mx-auto max-w-4xl px-4">
            {" "}
            <AccountNavigation />
            <div className="text-xl">
                {" "}
                <h1 className="text-2xl font-bold">
                    {" "}
                    Ваше бронирование: {booking.property.title},{" "}
                    {booking.property.city}
                </h1>
                <div className="flex gap-10">
                    <div className="font-semibold flex flex-col gap-2 border rounded-2xl  mt-6 px-4 shadow-sm">
                        <p className="text-lg py-2">
                            {" "}
                            Дата заселения:{" "}
                            <span className="font-semibold">
                                {booking.checkInDate}
                            </span>
                        </p>
                        <p className="text-lg py-2 border-t">
                            Дата выселения:{" "}
                            <span className="font-semibold">
                                {booking.checkOutDate}
                            </span>
                        </p>
                        <div className="flex border-t">
                            <p className="py-2">Адрес :</p>
                            <a
                                target="_blank"
                                href={`https://maps.google.com/?q=${booking.property.address}`}
                                className="flex items-center font-normal underline"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="size-6 mt-2"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                г. {booking.property.city},{" "}
                                {booking.property.address}
                            </a>
                        </div>
                        <div className=" border-t">
                            {booking.status === "confirmed" && (
                                <div className="flex items-center gap-3">
                                    <div className="py-2">Статус:</div>
                                    <Icon.Confirmed />
                                    <div className="">Подтверждено</div>
                                </div>
                            )}
                            {booking.status === "cancelled" && (
                                <div className="flex items-center gap-3">
                                    <div className="">Статус:</div>
                                    <Icon.Cancelled />
                                    <div className="">Отменено</div>
                                </div>
                            )}
                            {booking.status === "archived" && (
                                <div className="flex items-center gap-3">
                                    <div className="">Статус:</div>
                                    <Icon.Confirmed />
                                    <div className="">Архивировано</div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="font-semibold flex flex-col gap-2 border rounded-2xl w-fit mt-6 px-4 shadow-sm">
                        <p className="text-lg py-2">
                            {" "}
                            Спальных мест:{" "}
                            <span className="font-semibold">
                                {booking.property.bedrooms}
                            </span>
                        </p>
                        <p className="text-lg py-2 border-t">
                            Душевых комнат:{" "}
                            <span className="font-semibold">
                                {booking.property.bathrooms}
                            </span>
                        </p>
                        <p className="text-lg py-2 border-t">
                            Количество гостей:{" "}
                            <span className="font-semibold">
                                {booking.guestsCount}
                            </span>
                        </p>
                        <p className="text-lg py-2 border-t">
                            Общая стоимость:{" "}
                            <span className="font-semibold">
                                {booking.totalPrice}₽
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-6 relative rounded-2xl overflow-hidden shadow-md">
                <div className="grid gap-1 grid-cols-[2fr_1fr]">
                    <div className="">
                        {booking.property.property_images[0] && (
                            <div className="">
                                <img
                                    src={`http://localhost:5000${
                                        booking.property.property_images.find(
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
                        {booking.property.property_images[1] && (
                            <img
                                src={`http://localhost:5000${booking.property.property_images[1].path}`}
                                alt=""
                                className="aspect-square object-cover rounded-2xl"
                            />
                        )}
                        <div className="overflow-hidden">
                            {booking.property.property_images[2] && (
                                <img
                                    src={`http://localhost:5000${booking.property.property_images[2].path}`}
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
            <div className="flex">
                <div className="flex flex-wrap justify-between mt-2 border rounded-2xl w-full p-4 gap-4 shadow-sm">
                    {booking.property.amenities.map((amenity) => (
                        <div
                            key={amenity.id}
                            className="flex gap-3 items-center"
                        >
                            <div className="">{amenityIcons[amenity.name]}</div>
                            <div className="font-medium">
                                {amenityTranslations[amenity.name] ||
                                    amenity.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-2 border rounded-2xl w-full p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <div className="w-24 h-24">
                        <Link className="">
                            <img
                                src={
                                    booking.property.user.avatar
                                        ? `http://localhost:5000${booking.property.user.avatar}`
                                        : "http://localhost:5000/static/default_avatar.jpg"
                                }
                                alt="host photo"
                                className="w-full h-full rounded-full border"
                            />
                        </Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <Icon.UserCheckIcon />
                            <p className="font-semibold text-lg">
                                Хозяин: {booking.property.user.firstName}
                            </p>
                        </div>

                        <div className="text-lg font-semibold flex gap-2 items-center">
                            <Icon.PhoneIcon />
                            <div className="">Телефон для связи:</div>
                            <div className="">
                                {booking.property.user.phone}
                            </div>
                        </div>
                    </div>
                    <div className="flex-col items-center px-14">
                        <div className="mt-2">
                            <button
                                onClick={() => setShowPropertyReviewPopup(true)}
                                className="cursor-pointer bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-full font-medium transition-colors"
                            >
                                Оставить отзыв о жилье
                            </button>
                        </div>
                        <div className="mt-2">
                            <button
                                onClick={() => setShowHostReviewPopup(true)}
                                className="cursor-pointer bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-full font-medium transition-colors"
                            >
                                Оставить отзыв о хозяине
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4 text-center">
                <button
                    onClick={cancelBooking}
                    className="cursor-pointer bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-full font-medium transition-colors"
                >
                    Отменить бронирование
                </button>
            </div>
            {showPropertyReviewPopup && (
                <ReviewPopup
                    type="property"
                    bookingId={booking.id}
                    targetId={booking.property.id}
                    bookingName={booking.property.title}
                    onClose={() => setShowPropertyReviewPopup(false)}
                    onSuccess={handleReviewSuccess}
                />
            )}
            {showHostReviewPopup && (
                <ReviewPopup
                    type="host"
                    targetId={booking.property.user.id}
                    bookingId={booking.id}
                    bookingHost={booking.property.user.firstName}
                    onClose={() => setShowHostReviewPopup(false)}
                    onSuccess={handleReviewSuccess}
                />
            )}
        </div>
    );
}
