import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AccountNavigation from "./AccountNavigation";

export default function AdminPanelPage() {
    const [activeTab, setActiveTab] = useState("users");
    const [users, setUsers] = useState([]);
    const [properties, setProperties] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (activeTab === "users") {
            fetchUsers();
        } else if (activeTab === "properties") {
            fetchProperties();
        } else {
            fetchBookings();
        }
    }, [activeTab]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get("/users/all");
            setUsers(data.rows);
        } catch (error) {
            console.error("Ошибка в запросе всех пользователей:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProperties = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get("/properties");
            setProperties(data.rows);
        } catch (error) {
            console.error("Ошибка запроса всех объявлений:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get("/bookings");
            setBookings(data.rows);
        } catch (error) {
            console.error("Ошибка запроса всех бронирований:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm(`Вы уверены, что хотите удалить этот ${type}?`))
            return;

        try {
            await axios.delete(`/${type}/${id}`);

            //Релоад данных после удаления
            if (type === "users") fetchUsers();
            if (type === "properties") fetchProperties();
            if (type === "bookings") fetchBookings();

            alert("Успешно удалено");
        } catch (error) {
            console.error(`Error deleting ${type}:`, error);
            alert("Ошибка при удалении");
        }
    };

    //Обработка строки поиска
    const filteredData = () => {
        const data =
            activeTab === "users"
                ? users
                : activeTab === "properties"
                ? properties
                : bookings;

        return data.filter((item) => {
            if (activeTab === "users") {
                return (
                    item.firstName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    item.lastName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    item.email.toLowerCase().includes(searchTerm.toLowerCase())
                );
            } else if (activeTab === "properties") {
                return (
                    item.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    item.city.toLowerCase().includes(searchTerm.toLowerCase())
                );
            } else {
                return (
                    item.property.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    item.user.firstName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                );
            }
        });
    };

    return (
        <div className="max-w-9xl mx-auto px-4">
            <AccountNavigation />

            <h1 className="text-3xl font-bold text-center my-8">
                Админ-панель
            </h1>

            <div className="flex flex-wrap gap-4 mb-6">
                <button
                    onClick={() => setActiveTab("users")}
                    className={`px-4 py-2 rounded-lg ${
                        activeTab === "users"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                    }`}
                >
                    Пользователи
                </button>
                <button
                    onClick={() => setActiveTab("properties")}
                    className={`px-4 py-2 rounded-lg ${
                        activeTab === "properties"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                    }`}
                >
                    Объявления
                </button>
                <button
                    onClick={() => setActiveTab("bookings")}
                    className={`px-4 py-2 rounded-lg ${
                        activeTab === "bookings"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                    }`}
                >
                    Бронирования
                </button>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder={`Поиск ${
                        activeTab === "users"
                            ? "пользователей"
                            : activeTab === "properties"
                            ? "объявлений"
                            : "бронирований"
                    }...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                />
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {activeTab === "users" && (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Имя
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Роль
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Действия
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredData().map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {user.firstName} {user.lastName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${
                                                    user.role === "admin"
                                                        ? "bg-purple-100 text-purple-800"
                                                        : "bg-blue-100 text-blue-800"
                                                }`}
                                            >
                                                {user.role === "admin"
                                                    ? "Админ"
                                                    : "Пользователь"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Link
                                                to={`/profile/admin/edit-user/${user.id}`}
                                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                            >
                                                Редактировать
                                            </Link>
                                            <div
                                                onClick={() =>
                                                    handleDelete(
                                                        "users",
                                                        user.id
                                                    )
                                                }
                                                className="text-red-600 hover:text-red-900 cursor-pointer"
                                            >
                                                Удалить
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {activeTab === "properties" && (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Название
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Город
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Цена
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Действия
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredData().map((property) => (
                                    <tr key={property.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {property.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            <Link
                                                to={`/property/${property.id}`}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                {property.title}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {property.city}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {property.pricePerNight}₽
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Link
                                                to={`/profile/properties/${property.id}`}
                                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                            >
                                                Редактировать
                                            </Link>
                                            <div
                                                onClick={() =>
                                                    handleDelete(
                                                        "properties",
                                                        property.id
                                                    )
                                                }
                                                className="text-red-600 hover:text-red-900 cursor-pointer"
                                            >
                                                Удалить
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {activeTab === "bookings" && (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Объявление
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Пользователь
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Даты
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Статус
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Действия
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredData().map((booking) => (
                                    <tr key={booking.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {booking.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            <Link
                                                to={`/property/${booking.property.id}`}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                {booking.property.title}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {booking.user.firstName}{" "}
                                            {booking.user.lastName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(
                                                booking.checkInDate
                                            ).toLocaleDateString()}{" "}
                                            -{" "}
                                            {new Date(
                                                booking.checkOutDate
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${
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
                                                    ? "Подтверждено"
                                                    : booking.status ===
                                                      "cancelled"
                                                    ? "Отменено"
                                                    : "Завершено"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Link
                                                to={`/profile/admin/edit-booking/${booking.id}`}
                                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                            >
                                                Редактировать
                                            </Link>

                                            <div
                                                onClick={() =>
                                                    handleDelete(
                                                        "bookings",
                                                        booking.id
                                                    )
                                                }
                                                className="text-red-600 hover:text-red-900 cursor-pointer"
                                            >
                                                Удалить
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}
