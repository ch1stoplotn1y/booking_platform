import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext.jsx";
export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [sucessMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    async function login(ev) {
        ev.preventDefault();
        setError(null);
        setSuccessMessage(null);
        try {
            const { data } = await axios.post(
                "auths/login",
                {
                    email,
                    password,
                },
                { withCredentials: true }
            );
            setUser(data);
            alert("Вы успешно вошли в систему");
            navigate("/");
        } catch (error) {
            let errorMessage = "Ошибка соединения с сервером";

            if (error.response) {
                // Сервер ответил с ошибкой
                errorMessage =
                    error.response.data?.message ||
                    error.response.statusText ||
                    `Ошибка сервера (${error.response.status})`;
            } else if (error.request) {
                // Запрос был сделан, но ответа не получено
                errorMessage = "Сервер не отвечает";
            }
            setError(errorMessage);
            console.error("Login error:", error);
        }
    }
    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center">Вход</h1>
                <form className="max-w-md mx-auto" onSubmit={login}>
                    <input
                        type="email"
                        placeholder="your@email.ru"
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value)}
                    />
                    <button className="login" type="submit">
                        Войти
                    </button>
                    <div className="text-center py-2 text-gray-500">
                        Еще не зарегистрированы?
                        <Link
                            className="underline text-black ml-2"
                            to="/register"
                        >
                            Создать аккаунт
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
