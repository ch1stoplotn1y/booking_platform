import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import AccountNavigation from "./AccountNavigation";
import { useState, useEffect } from "react";
import axios from "axios";

export default function PropertiesPage() {
    const [properties, setProperties] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState("all");

    useEffect(() => {
        setIsLoading(true);
        Promise.all([
            axios.get("/users/me/properties"),
            axios.get("/users/me/bookings"),
        ])
            .then(([propertiesRes, bookingsRes]) => {
                setProperties(propertiesRes.data);
                setBookings(bookingsRes.data);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    // Получаем ID всех забронированных properties
    const bookedPropertyIds = bookings
        .filter((booking) => booking.status === "confirmed")
        .map((booking) => booking.property.id);

    // Фильтр объектов в зависимости от активного фильтра
    const filteredProperties = properties.filter((property) => {
        if (activeFilter === "all") return true;
        if (activeFilter === "booked")
            return bookedPropertyIds.includes(property.id);
        return !bookedPropertyIds.includes(property.id);
    });

    return (
        <div className="min-h-screen">
            <AccountNavigation />

            <div className="max-w-6xl mx-auto p-8">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Ваши объявления
                    </h1>
                    <Link
                        to="/profile/properties/new"
                        className="inline-flex items-center p-6 gap-2 bg-gradient-to-r from-red-400 to-pink-500 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4.5v15m7.5-7.5h-15"
                            />
                        </svg>
                        Создать объявление
                    </Link>
                </div>

                {/* Фильтры */}
                <div className="flex flex-wrap gap-3 mb-8">
                    <button
                        onClick={() => setActiveFilter("all")}
                        className={`px-4 py-2 rounded-full ${
                            activeFilter === "all"
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100 hover:bg-gray-200"
                        }`}
                    >
                        Все объявления
                    </button>
                    <button
                        onClick={() => setActiveFilter("booked")}
                        className={`px-4 py-2 rounded-full ${
                            activeFilter === "booked"
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100 hover:bg-gray-200"
                        }`}
                    >
                        Забронированные
                    </button>
                    <button
                        onClick={() => setActiveFilter("available")}
                        className={`px-4 py-2 rounded-full ${
                            activeFilter === "available"
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100 hover:bg-gray-200"
                        }`}
                    >
                        Свободные
                    </button>
                </div>

                {/* Список объявлений */}
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : filteredProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProperties.map((property) => {
                            const isBooked = bookedPropertyIds.includes(
                                property.id
                            );
                            return (
                                <Link
                                    to={`/profile/properties/${property.id}`}
                                    key={property.id}
                                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 relative"
                                >
                                    {/* Бейдж статуса бронирования */}
                                    {isBooked && (
                                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            Забронировано
                                        </div>
                                    )}

                                    {/* Изображения */}
                                    <div className="h-48 overflow-hidden">
                                        {property.property_images.length > 0 ? (
                                            <img
                                                src={`http://localhost:5000${property.property_images[0].path}`}
                                                alt={property.title}
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
                                    <div className="p-4">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                                            {property.title}
                                        </h3>
                                        <p className="text-gray-600 mb-2">
                                            {property.city}, {property.country}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center text-indigo-600">
                                                <span>Изменить</span>
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
                                            {isBooked && (
                                                <span className="text-sm text-green-600">
                                                    Активная бронь
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
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
                            {activeFilter === "booked"
                                ? "Нет забронированных объявлений"
                                : activeFilter === "available"
                                ? "Нет свободных объявлений"
                                : "У вас пока нет объявлений"}
                        </h3>
                        <p className="text-gray-500 mb-4">
                            {activeFilter === "booked"
                                ? "Когда ваши объявления будут забронированы, они появятся здесь"
                                : activeFilter === "available"
                                ? "Все ваши объявления в настоящее время забронированы"
                                : "Создайте первое объявление, чтобы начать принимать гостей"}
                        </p>
                        {activeFilter !== "all" && (
                            <button
                                onClick={() => setActiveFilter("all")}
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                Показать все объявления
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
