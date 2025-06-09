import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useContext } from "react";
import { useInput, useValidation } from "../utils/customHooks/registerHook.jsx";
import { UserContext } from "../contexts/UserContext.jsx";
export default function LoginPage() {
    //Состояния для полей формы
    const email = useInput("", { isEmpty: true });
    const password = useInput("", { isEmpty: true });
    const navigate = useNavigate();
    const { login } = useContext(UserContext);
    //Функция с запросом на логин
    async function handleLogin(ev) {
        ev.preventDefault();
        try {
            await login({ email: email.value, password: password.value });
            navigate("/"); // Перенаправляем после успешного логина
        } catch (error) {
            alert(error.response?.data?.message || "Ошибка входа");
        }
    }
    //Компонент формы авторизации
    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center">Вход</h1>
                <form className="max-w-md mx-auto" onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Ваш логин"
                        value={email.value}
                        onChange={(ev) => email.onChange(ev)}
                        onBlur={(ev) => email.onBlur(ev)}
                    />
                    <input
                        type="password"
                        placeholder="Ваш пароль"
                        value={password.value}
                        onChange={(ev) => password.onChange(ev)}
                        onBlur={(ev) => password.onBlur(ev)}
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
