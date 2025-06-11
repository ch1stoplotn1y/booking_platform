import { Link } from "react-router-dom";
import * as Icon from "../icons/iconsStorage";
import {
    FaAirbnb,
    FaInstagram,
    FaTwitter,
    FaFacebookF,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white pt-12 pb-6 mt-16 rounded-2xl">
            <div className="max-w-7xl mx-auto px-4">
                {/* Основные разделы */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* О компании */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center">
                            <Icon.MainLogo
                                className="text-rose-500 mr-2"
                                size={24}
                            />
                            RoamStay
                        </h3>
                        <p className="text-gray-400">
                            Открывайте для себя уникальные места для проживания
                            по всей россии вместе с RoamStay.
                        </p>
                    </div>

                    {/* Навигация */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">
                            Навигация
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/"
                                    className="text-gray-400 hover:text-white transition"
                                >
                                    Главная
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/"
                                    className="text-gray-400 hover:text-white transition"
                                >
                                    Жилье
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/"
                                    className="text-gray-400 hover:text-white transition"
                                >
                                    О нас
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/"
                                    className="text-gray-400 hover:text-white transition"
                                >
                                    Контакты
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Контакты */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Контакты</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li className="flex items-start">
                                <FaMapMarkerAlt className="mt-1 mr-3 flex-shrink-0" />
                                <span>г. Москва, ул. Примерная, 123</span>
                            </li>
                            <li className="flex items-center">
                                <FaPhone className="mr-3" />
                                <span>+7 (123) 456-78-90</span>
                            </li>
                            <li className="flex items-center">
                                <FaEnvelope className="mr-3" />
                                <span>hello@roamstay.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Соцсети */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">
                            Мы в соцсетях
                        </h4>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="bg-gray-800 hover:bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center transition"
                            >
                                <FaInstagram />
                            </a>
                            <a
                                href="#"
                                className="bg-gray-800 hover:bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center transition"
                            >
                                <FaTwitter />
                            </a>
                            <a
                                href="#"
                                className="bg-gray-800 hover:bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center transition"
                            >
                                <FaFacebookF />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Копирайт */}
                <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm mb-4 md:mb-0">
                        © {new Date().getFullYear()} RoamStay. Все права
                        защищены.
                    </p>
                    <div className="flex space-x-6">
                        <Link
                            to="/privacy"
                            className="text-gray-500 hover:text-white text-sm transition"
                        >
                            Политика конфиденциальности
                        </Link>
                        <Link
                            to="/terms"
                            className="text-gray-500 hover:text-white text-sm transition"
                        >
                            Условия использования
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
