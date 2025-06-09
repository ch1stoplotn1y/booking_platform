export default function SingleUserProfile() {
    return (
        <div className="max-w-6xl mx-auto">
            <AccountNavigation />
            {subpage === "account" && (
                <div className="text-center max-w-2xl mx-auto p-4">
                    {/* Аватар */}
                    <div className="w-20 h-20">{user.avatar === null}</div>

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
