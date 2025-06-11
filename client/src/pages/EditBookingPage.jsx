import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditBookingPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState({
        checkInDate: "",
        checkOutDate: "",
        guestsCount: 1,
        status: "confirmed",
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const { data } = await axios.get(`/bookings/${id}`);
                setBooking({
                    ...data,
                    checkInDate: data.checkInDate.split("T")[0],
                    checkOutDate: data.checkOutDate.split("T")[0],
                });
            } catch (error) {
                console.error("Ошибка загрузки бронирования:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBooking();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBooking((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/bookings/${id}`, booking);
            alert("Бронирование успешно обновлено");
            navigate("/profile/admin");
        } catch (error) {
            console.error("Ошибка обновления бронирования:", error);
            alert("Ошибка при обновлении бронирования");
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
                Редактирование бронирования
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Дата заезда
                    </label>
                    <input
                        type="date"
                        name="checkInDate"
                        value={booking.checkInDate}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Дата выезда
                    </label>
                    <input
                        type="date"
                        name="checkOutDate"
                        value={booking.checkOutDate}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Количество гостей
                    </label>
                    <input
                        type="number"
                        name="guestsCount"
                        value={booking.guestsCount}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                        min="1"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Статус
                    </label>
                    <select
                        name="status"
                        value={booking.status}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="confirmed">Подтверждено</option>
                        <option value="cancelled">Отменено</option>
                        <option value="archived">Завершено</option>
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
