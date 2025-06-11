import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditUserPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "user",
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await axios.get(`/users/${id}`);
                setUser(data);
            } catch (error) {
                console.error("Ошибка загрузки пользователя:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/users/${id}`, user);
            alert("Пользователь успешно обновлен");
            navigate("/profile/admin");
        } catch (error) {
            console.error("Ошибка обновления пользователя:", error);
            alert("Ошибка при обновлении пользователя");
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">
                Редактирование пользователя
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Имя
                    </label>
                    <input
                        type="text"
                        name="firstName"
                        value={user.firstName}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Фамилия
                    </label>
                    <input
                        type="text"
                        name="lastName"
                        value={user.lastName}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Телефон
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={user.phone || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Роль
                    </label>
                    <select
                        name="role"
                        value={user.role}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="user">Пользователь</option>
                        <option value="admin">Администратор</option>
                    </select>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => navigate("/profile/admin")}
                        className="bg-gray-200 py-2 px-4 rounded-md hover:bg-gray-300"
                    >
                        Отмена
                    </button>
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                    >
                        Сохранить
                    </button>
                </div>
            </form>
        </div>
    );
}
