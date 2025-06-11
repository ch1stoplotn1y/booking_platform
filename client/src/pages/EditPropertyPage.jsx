import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditPropertyPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState({
        title: "",
        description: "",
        city: "",
        country: "",
        pricePerNight: "",
        bedrooms: 1,
        bathrooms: 1,
        MaxGuests: 1,
        squareMeters: "",
        type: "apartment",
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const { data } = await axios.get(`/properties/${id}`);
                setProperty(data);
            } catch (error) {
                console.error("Ошибка загрузки объявления:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProperty((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/admin/properties/${id}`, property);
            alert("Объявление успешно обновлено");
            navigate("/profile/admin");
        } catch (error) {
            console.error("Ошибка обновления объявления:", error);
            alert("Ошибка при обновлении объявления");
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
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">
                Редактирование объявления
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Название
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={property.title}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Тип жилья
                        </label>
                        <select
                            name="type"
                            value={property.type}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="apartment">Квартира</option>
                            <option value="house">Дом</option>
                            <option value="villa">Вилла</option>
                            <option value="room">Комната</option>
                            <option value="cottage">Коттедж</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Город
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={property.city}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Страна
                        </label>
                        <input
                            type="text"
                            name="country"
                            value={property.country}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Цена за ночь (₽)
                        </label>
                        <input
                            type="number"
                            name="pricePerNight"
                            value={property.pricePerNight}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                            min="1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Площадь (м²)
                        </label>
                        <input
                            type="number"
                            name="squareMeters"
                            value={property.squareMeters}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                            min="1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Спальни
                        </label>
                        <input
                            type="number"
                            name="bedrooms"
                            value={property.bedrooms}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                            min="1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Ванные
                        </label>
                        <input
                            type="number"
                            name="bathrooms"
                            value={property.bathrooms}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                            min="1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Гостей
                        </label>
                        <input
                            type="number"
                            name="MaxGuests"
                            value={property.MaxGuests}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                            min="1"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Описание
                    </label>
                    <textarea
                        name="description"
                        value={property.description}
                        onChange={handleChange}
                        rows="4"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
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
