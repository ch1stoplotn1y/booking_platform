import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext.jsx";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import PropertiesPage from "./PropertiesPage.jsx";
import AccountNavigation from "./AccountNavigation.jsx";
import axios from "axios";
import * as Icon from "../icons/Icons";

export default function ProfilePage() {
    const navigate = useNavigate();
    const { loaded, user, isLoggingOut, logout, setUser } =
        useContext(UserContext);
    let { subpage } = useParams();
    const [avatar, setAvatar] = useState(user?.avatar || null);
    const [isUploading, setIsUploading] = useState(false);

    if (subpage === undefined) {
        subpage = "account";
    }

    async function handleLogout() {
        navigate("/");
        await logout();
    }

    if (!loaded) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (loaded && !user) {
        return <Navigate to={"/login"} />;
    }

    if (isLoggingOut) {
        return null;
    }

    async function uploadAvatar(ev) {
        try {
            setIsUploading(true);
            const file = ev.target.files[0];
            if (!file) {
                throw new Error("Файл не выбран");
            }
            const formData = new FormData();
            formData.append("avatar", file);

            const response = await axios.patch("/users/me/avatar", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setUser((prev) => ({
                ...prev,
                avatar: response.data.avatarUrl,
            }));
            setIsUploading(false);
            return response.data;
        } catch (error) {
            console.error(
                "Ошибка загрузки аватара:",
                error.response?.data?.message || error.message
            );
            alert(error.response?.data?.message || error.message);
            setIsUploading(false);
            throw error;
        }
    }
    async function deleteAvatar() {
        try {
            if (!window.confirm("Вы уверены, что хотите удалить аватар?")) {
                return;
            }

            await axios.patch("/users/me/avatar/delete");

            setUser((prev) => ({
                ...prev,
                avatar: null,
            }));
        } catch (error) {
            console.error(
                "Ошибка удаления аватара:",
                error.response?.data?.message || error.message
            );
            alert(error.response?.data?.message || error.message);
        }
    }

    return (
        <div className="max-w-6xl mx-auto">
            <AccountNavigation />
            {subpage === "account" && (
                <div className="text-center max-w-2xl mx-auto p-4">
                    {/* Аватар */}
                    <div className="relative mx-auto w-48 h-48 mb-6">
                        {user.avatar === null ? (
                            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-gray-300 group">
                                <input
                                    accept="image/*"
                                    type="file"
                                    onChange={uploadAvatar}
                                    className="absolute inset-0 z-10 w-full h-full cursor-pointer opacity-0"
                                    disabled={isUploading}
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 group-hover:bg-gray-200">
                                    {isUploading ? (
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            className="w-12 h-12 text-gray-400"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                            />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-gray-300 group">
                                <img
                                    src={`http://localhost:5000${user.avatar}`}
                                    alt="Аватар"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() =>
                                            document
                                                .querySelector(
                                                    'input[type="file"]'
                                                )
                                                .click()
                                        }
                                        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                                        title="Изменить аватар"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-5 h-5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6.827 6.175a2.25 2.25 0 0 1 2.25-2.25h3.086a2.25 2.25 0 0 1 1.67.738l1.956 2.128a2.25 2.25 0 0 0 1.67.738h3.086a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25H6.75a2.25 2.25 0 0 1-2.25-2.25v-9Z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={deleteAvatar}
                                        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                                        title="Удалить аватар"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-5 h-5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                <input
                                    accept="image/*"
                                    type="file"
                                    onChange={uploadAvatar}
                                    className="hidden"
                                />
                            </div>
                        )}
                    </div>

                    {/* Основная информация */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            {user.firstName} {user.lastName}
                        </h1>

                        {/* Рейтинг хозяина */}
                        {user.hostRating ? (
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <div className="flex items-center bg-indigo-100 px-4 py-2 rounded-full">
                                    <Icon.StarIcon className="w-5 h-5 text-yellow-500" />
                                    <span className="ml-1 font-medium">
                                        Рейтинг хозяина:{" "}
                                        {user.hostRating.toFixed(1)}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-500 mb-4">
                                {user.properties.length > 0
                                    ? "Ваши гости еще не оставили отзывов"
                                    : "Вы еще не размещали объявлений"}
                            </div>
                        )}
                    </div>

                    {/* Детальная информация */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-8 text-left">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                            Контактная информация
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Icon.CheckInIcon />
                                <span className="text-gray-700">
                                    {user.email}
                                </span>
                            </div>

                            {user.phone && (
                                <div className="flex items-center gap-3">
                                    <Icon.PhoneIcon />
                                    <span className="text-gray-700">
                                        {user.phone}
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <Icon.CheckInIcon />
                                <span className="text-gray-700">
                                    {user.firstName} {user.lastName}
                                </span>
                            </div>

                            {user.createdAt && (
                                <div className="flex items-center gap-3">
                                    <Icon.Confirmed />
                                    <span className="text-gray-700">
                                        С нами с{" "}
                                        {new Date(
                                            user.createdAt
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Статистика */}
                    {user.properties.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                                Ваша статистика
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-indigo-50 p-4 rounded-lg">
                                    <div className="text-indigo-600 font-bold text-2xl">
                                        {user.properties.length}
                                    </div>
                                    <div className="text-gray-600">
                                        {user.properties.length === 1
                                            ? "Объявление"
                                            : "Объявлений"}
                                    </div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="text-green-600 font-bold text-2xl">
                                        {user.bookings.length || 0}
                                    </div>
                                    <div className="text-gray-600">
                                        {user.bookings.length === 1
                                            ? "Бронирование"
                                            : "Бронирований"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        className="py-3 px-6 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Выйти из аккаунта
                    </button>
                </div>
            )}
            {subpage === "properties" && <PropertiesPage />}
        </div>
    );
}
