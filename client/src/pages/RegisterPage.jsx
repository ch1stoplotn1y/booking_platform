import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    async function registerUser(ev) {
        //Не перезагружать страниц
        ev.preventDefault();
        setError(null);
        setSuccessMessage(null); // Сбрасываем предыдущие сообщения
        try {
            const response = await axios.post("auths/registration", {
                firstName,
                lastName,
                phone,
                email,
                password,
            });
            alert("Вы успешно зарегистрированы! Войдите в учетную запись.");
            // setSuccessMessage(
            //     "Регистрация прошла успешно! Вы будете перенаправлены..."
            // );
            //Перенаправление на логин
            navigate("/login");
        } catch (error) {
            let errorMessage = "Ошибка соединения с сервером";

            if (error.response) {
                // Сервер ответил с ошибкой (4xx/5xx)
                errorMessage =
                    error.response.data?.message ||
                    error.response.statusText ||
                    `Ошибка сервера (${error.response.status})`;
            } else if (error.request) {
                // Запрос был сделан, но ответа не получено
                errorMessage = "Сервер не отвечает";
            }

            setError(errorMessage);
            console.error("Registration error:", error);
        }
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center">Регистрация</h1>
                {/* {error && (
                    <div className="text-red-500 text-center mb-4">{error}</div>
                )}
                {successMessage && (
                    <div className="text-green-500 text-center mb-4">
                        {successMessage}
                    </div>
                )} */}
                <form className="max-w-md mx-auto" onSubmit={registerUser}>
                    <input
                        type="text"
                        placeholder="Имя"
                        value={firstName}
                        onChange={(ev) => setFirstName(ev.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Фамилия"
                        value={lastName}
                        onChange={(ev) => setLastName(ev.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Телефон"
                        value={phone}
                        onChange={(ev) => setPhone(ev.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value)}
                    />
                    <button className="register" type="submit">
                        Зарегистрироваться
                    </button>
                    <div className="text-center py-2 text-gray-500">
                        Уже зарегистрованы?
                        <Link className="underline text-black ml-2" to="/login">
                            Войти в учетную запись
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
