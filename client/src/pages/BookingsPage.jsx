import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import AccountNavigation from "./AccountNavigation";
import axios from "axios";

export default function BookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState("confirmed");

    useEffect(() => {
        setIsLoading(true);
        axios
            .get("/users/me/bookings")
            .then(({ data }) => {
                setBookings(data);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    // Фильтр бронирований по статусу
    const filteredBookings = bookings.filter((booking) =>
        activeFilter === "confirmed"
            ? booking.status === "confirmed"
            : activeFilter === "cancelled"
            ? booking.status === "cancelled"
            : booking.status === "archived"
    );

    return (
        <div className="flex">
            {/* Боковая панель с фильтрами */}
            <div className="w-64 p-4 border-r border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Фильтровать по:</h2>
                <div className="space-y-2">
                    <button
                        onClick={() => setActiveFilter("confirmed")}
                        className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg transition-colors ${
                            activeFilter === "confirmed"
                                ? "bg-indigo-100 text-indigo-700 font-medium"
                                : "hover:bg-gray-100"
                        }`}
                    >
                        Активные бронирования
                    </button>
                    <button
                        onClick={() => setActiveFilter("cancelled")}
                        className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg transition-colors ${
                            activeFilter === "cancelled"
                                ? "bg-indigo-100 text-indigo-700 font-medium"
                                : "hover:bg-gray-100"
                        }`}
                    >
                        Отмененные бронирования
                    </button>
                    <button
                        onClick={() => setActiveFilter("archived")}
                        className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg transition-colors ${
                            activeFilter === "archived"
                                ? "bg-indigo-100 text-indigo-700 font-medium"
                                : "hover:bg-gray-100"
                        }`}
                    >
                        Завершенные бронирования
                    </button>
                </div>
            </div>

            {/* Основное содержимое */}
            <div className="flex-1">
                <AccountNavigation />

                <div className="text-center px-4 py-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {activeFilter === "confirmed" &&
                            "Активные бронирования"}
                        {activeFilter === "cancelled" &&
                            "Отмененные бронирования"}
                        {activeFilter === "archived" &&
                            "Завершенные бронирования"}
                    </h1>

                    {/* Список объявлений */}
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                        </div>
                    ) : filteredBookings.length > 0 ? (
                        <div className="mt-10 flex flex-wrap justify-center gap-6">
                            {filteredBookings.map((booking) => (
                                <Link
                                    to={`/profile/bookings/${booking.id}`}
                                    key={booking.property.id}
                                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 w-80"
                                >
                                    {/* Изображения */}
                                    <div className="h-48 overflow-hidden">
                                        {booking.property.property_images
                                            .length > 0 ? (
                                            <img
                                                src={`http://localhost:5000${booking.property.property_images[0].path}`}
                                                alt={booking.property.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-500">
                                                    Нет изображений
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Детали объявления */}
                                    <div className="p-4 flex flex-col gap-2">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                                            {booking.property.title}
                                        </h3>
                                        <span className="text-gray-600 text-left">
                                            {booking.property.city},{" "}
                                            {booking.property.country}
                                        </span>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="text-indigo-600 flex items-center">
                                                <span>Подробнее</span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={2}
                                                    stroke="currentColor"
                                                    className="w-4 h-4 ml-1"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                                    />
                                                </svg>
                                            </div>
                                            <span
                                                className={`text-sm px-2 py-1 rounded ${
                                                    booking.status ===
                                                    "confirmed"
                                                        ? "bg-green-100 text-green-800"
                                                        : booking.status ===
                                                          "cancelled"
                                                        ? "bg-red-100 text-red-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}
                                            >
                                                {booking.status === "confirmed"
                                                    ? "Активно"
                                                    : booking.status ===
                                                      "cancelled"
                                                    ? "Отменено"
                                                    : "Завершено"}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl shadow-sm max-w-2xl mx-auto">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-12 h-12 mx-auto text-gray-400 mb-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5"
                                />
                            </svg>
                            <h3 className="text-xl font-medium text-gray-700 mb-2">
                                {activeFilter === "confirmed" &&
                                    "Нет активных бронирований"}
                                {activeFilter === "cancelled" &&
                                    "Нет отмененных бронирований"}
                                {activeFilter === "archived" &&
                                    "Нет завершенных бронирований"}
                            </h3>
                            <p className="text-gray-500 mb-4">
                                {activeFilter === "confirmed" &&
                                    "Найдите жилье для своей следующей поездки!"}
                                {activeFilter === "cancelled" &&
                                    "Здесь будут отображаться ваши отмененные бронирования"}
                                {activeFilter === "archived" &&
                                    "Здесь будут отображаться ваши прошлые бронирования"}
                            </p>
                            {activeFilter === "confirmed" && (
                                <Link
                                    to="/"
                                    className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Найти жилье
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
