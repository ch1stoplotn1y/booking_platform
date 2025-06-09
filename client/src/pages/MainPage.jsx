import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { getGuestsWord, typeTranslations } from "../utils/utils";

export default function MainPage() {
    const [properties, setProperties] = useState({ rows: [], count: 0 });
    const [filters, setFilters] = useState({
        city: "",
        minPrice: "",
        maxPrice: "",
        maxGuests: "",
        amenities: [],
    });
    const [cities, setCities] = useState([]);
    const [amenitiesList, setAmenitiesList] = useState([]);

    useEffect(() => {
        axios.get("/properties").then(({ data }) => {
            setProperties(data);

            const uniqueCities = [...new Set(data.rows.map((p) => p.city))];
            setCities(uniqueCities);
        });
    }, []);

    // Функция для применения фильтров
    const applyFilters = () => {
        const params = {
            city: filters.city || undefined,
            minPrice: filters.minPrice || undefined,
            maxPrice: filters.maxPrice || undefined,
            maxGuests: filters.maxGuests || undefined,
            amenities:
                filters.amenities.length > 0 ? filters.amenities : undefined,
            type: filters.type || undefined,
        };
        axios
            .get("/properties", { params })
            .then(({ data }) => setProperties(data));
    };

    // Сброс фильтров
    const resetFilters = () => {
        setFilters({
            city: "",
            minPrice: "",
            maxPrice: "",
            maxGuests: "",
            amenities: [],
            type: "",
        });
        axios.get("/properties").then(({ data }) => setProperties(data));
    };

    // Обработчик изменения фильтров
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleTypeChange = (e) => {
        setFilters((prev) => ({ ...prev, type: e.target.value }));
    };

    // Обработчик удобств
    const handleAmenityChange = (amenity) => {
        setFilters((prev) => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter((a) => a !== amenity)
                : [...prev.amenities, amenity],
        }));
    };

    return (
        <div className="max-w-7xl mx-auto px-4">
            <div className="bg-white p-6 rounded-2xl shadow-md mb-8 mt-4">
                <div className="flex flex-wrap items-end gap-4">
                    {/* Город */}
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Город
                        </label>
                        <select
                            name="city"
                            value={filters.city}
                            onChange={handleFilterChange}
                            className="w-full border my-2 py-2 px-3 rounded-2xl h-[42px]"
                        >
                            <option value="">Все города</option>
                            {cities.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Тип жилья
                        </label>
                        <select
                            name="type"
                            value={filters.type}
                            onChange={handleFilterChange}
                            className="w-full border my-2 py-2 px-3 rounded-2xl h-[42px]"
                        >
                            <option value="">Все типы</option>
                            <option value="apartment">Квартира</option>
                            <option value="room">Комната</option>
                            <option value="villa">Вилла</option>
                            <option value="house">Дом</option>
                            <option value="cottage">Коттедж</option>
                        </select>
                    </div>

                    {/* Ценовой диапазон */}
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Цена за ночь
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                name="minPrice"
                                placeholder="От"
                                value={filters.minPrice}
                                onChange={handleFilterChange}
                                className="w-full border my-2 py-2 px-3 rounded-2xl h-[42px]"
                            />
                            <input
                                type="number"
                                name="maxPrice"
                                placeholder="До"
                                value={filters.maxPrice}
                                onChange={handleFilterChange}
                                className="w-full border my-2 py-2 px-3 rounded-2xl h-[42px]"
                            />
                        </div>
                    </div>

                    {/* Гости */}
                    <div className="flex-1 min-w-[150px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Гостей
                        </label>
                        <input
                            type="number"
                            name="maxGuests"
                            placeholder="Макс. гостей"
                            value={filters.maxGuests}
                            onChange={handleFilterChange}
                            className="w-full border my-2 py-2 px-3 rounded-2xl h-[42px]"
                        />
                    </div>

                    <div className="flex-1 min-w-[200px] flex gap-2 h-[68px] items-end">
                        <button
                            onClick={applyFilters}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex-1 mb-2"
                        >
                            Применить
                        </button>
                        <button
                            onClick={resetFilters}
                            className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 flex-1 mb-2"
                        >
                            Сбросить
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {properties.rows.map((property) => (
                    <Link
                        to={`/property/${property.id}`}
                        key={property.id}
                        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="w-full aspect-square relative">
                            {property.property_images.length > 0 && (
                                <img
                                    src={`http://localhost:5000${
                                        property.property_images.find(
                                            (img) => img.isMain
                                        )?.path
                                    }`}
                                    alt={property.title}
                                    className="w-full h-full object-cover"
                                />
                            )}
                            <div className="absolute bottom-2 left-2 bg-white/80 px-2 py-1 rounded-lg text-sm">
                                {property.pricePerNight}₽ / ночь
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg mb-1">
                                {typeTranslations[property.type]},{" "}
                                {property.city}
                            </h3>
                            <p className="text-gray-600 text-sm truncate">
                                {property.title}
                            </p>
                            <div className="flex items-center mt-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-4 h-4 text-yellow-500"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="ml-1 text-sm">
                                    {property.rating
                                        ? parseFloat(property.rating).toFixed(1)
                                        : "Нет рейтинга"}
                                </span>
                                <span className="mx-2"></span>
                                <span className="text-sm">
                                    {property.MaxGuests}{" "}
                                    {getGuestsWord(property.MaxGuests)}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {properties.count > properties.rows.length && (
                <div className="flex justify-center mt-8">
                    <button className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300">
                        Показать еще
                    </button>
                </div>
            )}
        </div>
    );
}
