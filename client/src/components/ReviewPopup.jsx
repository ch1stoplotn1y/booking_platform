import { useState } from "react";
import axios from "axios";

export default function ReviewPopup({
    type,
    targetId,
    onClose,
    onSuccess,
    bookingId,
    bookingName,
    bookingHost,
}) {
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState("");
    const [cleanliness, setCleanliness] = useState(1);
    const [accuracy, setAccuracy] = useState(1);
    const [communication, setCommunication] = useState(1);
    const [location, setLocation] = useState(1);
    const [checkIn, setCheckIn] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const endpoint =
                type === "property"
                    ? "/reviews/property-reviews"
                    : "/reviews/host-reviews";

            const data =
                type === "property"
                    ? {
                          propertyId: targetId,
                          bookingId,
                          rating,
                          comment,
                          cleanliness,
                          accuracy,
                          communication,
                          location,
                          checkIn,
                      }
                    : {
                          hostId: targetId,
                          bookingId,
                          rating,
                          comment,
                      };

            await axios.post(endpoint, data);

            onSuccess();
            onClose();
        } catch (error) {
            console.error("Ошибка при отправке отзыва:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderRatingCategory = (label, value, setter) => (
        <div className="mb-4">
            <label className="block mb-2 text-lg font-medium text-gray-700">
                {label}:
            </label>
            <div className="flex items-center gap-2">
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setter(star)}
                            className={`text-3xl transition-colors ${
                                star <= value
                                    ? "text-yellow-400 hover:text-yellow-500"
                                    : "text-gray-300 hover:text-gray-400"
                            }`}
                        >
                            {star <= value ? "★" : "☆"}
                        </button>
                    ))}
                </div>
                <span className="text-lg font-medium text-gray-600">
                    {value} из 5
                </span>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className="fixed inset-0 bg-gray-100 bg-opacity-40 transition-opacity"
                onClick={onClose}
            ></div>

            <div className="flex min-h-full items-center justify-center p-4 text-center">
                <div className="relative w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Оставить отзыв о{" "}
                            <span className="text-green-600">
                                {type === "property"
                                    ? `жилье ${bookingName}`
                                    : `хозяине ${bookingHost}`}
                            </span>
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 rounded-full p-1 hover:bg-gray-100 transition-colors"
                        >
                            <svg
                                className="h-8 w-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {renderRatingCategory(
                            "Общая оценка",
                            rating,
                            setRating
                        )}
                        {type === "property" && (
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                {renderRatingCategory(
                                    "Чистота",
                                    cleanliness,
                                    setCleanliness
                                )}
                                {renderRatingCategory(
                                    "Соответствие описанию",
                                    accuracy,
                                    setAccuracy
                                )}
                                {renderRatingCategory(
                                    "Коммуникация",
                                    communication,
                                    setCommunication
                                )}
                                {renderRatingCategory(
                                    "Расположение",
                                    location,
                                    setLocation
                                )}
                                {renderRatingCategory(
                                    "Процесс заселения",
                                    checkIn,
                                    setCheckIn
                                )}
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="comment"
                                className="block text-lg font-medium text-gray-700 mb-2"
                            >
                                Ваш отзыв
                            </label>
                            <textarea
                                id="comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-700 transition-all"
                                rows="6"
                                required
                                placeholder={`Расскажите подробно о вашем опыте ${
                                    type === "property"
                                        ? "проживания в этом месте"
                                        : "взаимодействия с хозяином"
                                }...`}
                            />
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-lg transition-colors duration-200"
                            >
                                Отменить
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium text-lg transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-32"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Отправка...
                                    </>
                                ) : (
                                    "Отправить отзыв"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
