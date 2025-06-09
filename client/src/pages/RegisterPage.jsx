import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext.jsx";
import { useInput, useValidation } from "../utils/customHooks/registerHook.jsx";

export default function RegisterPage() {
    // const [firstName, setFirstName] = useState("");
    const firstName = useInput("", { isEmpty: true, minLength: 2 });
    const lastName = useInput("", { isEmpty: true, minLength: 2 });
    const email = useInput("", { isEmpty: true, isEmail: true });
    const phone = useInput("", { isEmpty: true, isRussianPhone: true });
    const password = useInput("", {
        isEmpty: true,
        minLength: 8,
        maxLength: 30,
    });
    // const [phone, setPhone] = useState("");
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");

    // const lastName = useInput("", { isEmpty: true, minLength: 2 });
    // const email = useInput("", { isEmpty: true });
    // const password = useInput("", { isEmpty: true, minLength: 8 });

    const navigate = useNavigate();
    const { register } = useContext(UserContext);
    async function handleRegister(ev) {
        ev.preventDefault();

        try {
            await register({
                firstName: firstName.value,
                lastName: lastName.value,
                phone: phone.value,
                email: email.value,
                password: password.value,
            });
            navigate("/login");
        } catch (error) {
            console.error("Registration error:", error);
        }
    }

    //Компонент для отображения формы регистрации
    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <form className="max-w-md mx-auto" onSubmit={handleRegister}>
                    <h1 className="text-4xl text-center">Регистрация</h1>
                    {firstName.isDirty && firstName.isEmpty && (
                        <div className="mt-2 text-red-500 text-center">
                            Введите имя
                        </div>
                    )}
                    {firstName.isDirty && firstName.minLengthError && (
                        <div className="mt-2 text-red-500 text-center">
                            Некорректная длина имени
                        </div>
                    )}
                    <input
                        type="text"
                        placeholder="Имя"
                        value={firstName.value}
                        onChange={(ev) => firstName.onChange(ev)}
                        onBlur={(ev) => firstName.onBlur(ev)}
                    />
                    {lastName.isDirty && lastName.isEmpty && (
                        <div className="mt-2 text-red-500 text-center">
                            Введите фамилию
                        </div>
                    )}
                    {lastName.isDirty && lastName.minLengthError && (
                        <div className="mt-2 text-red-500 text-center">
                            Некорректная длина фамилии
                        </div>
                    )}
                    <input
                        type="text"
                        placeholder="Фамилия"
                        value={lastName.value}
                        onChange={(ev) => lastName.onChange(ev)}
                        onBlur={(ev) => lastName.onBlur(ev)}
                    />
                    {phone.isDirty && phone.isEmpty && (
                        <div className="mt-2 text-red-500 text-center">
                            Введите телефон
                        </div>
                    )}
                    {phone.isDirty && phone.phoneError && (
                        <div className="mt-2 text-red-500 text-center">
                            Неверный формат телефона
                        </div>
                    )}
                    <input
                        type="text"
                        placeholder="Введите телефон в формате (+7)"
                        value={phone.value}
                        onChange={(ev) => phone.onChange(ev)}
                        onBlur={(ev) => phone.onBlur(ev)}
                    />
                    {email.isDirty && email.isEmpty && (
                        <div className="mt-2 text-red-500 text-center">
                            Введите email
                        </div>
                    )}
                    {email.isDirty && email.emailError && (
                        <div className="mt-2 text-red-500 text-center">
                            Неверный формат email
                        </div>
                    )}
                    <input
                        type="email"
                        placeholder="yourEmail@mail.ru"
                        value={email.value}
                        onChange={(ev) => email.onChange(ev)}
                        onBlur={(ev) => email.onBlur(ev)}
                    />
                    {password.isDirty && password.isEmpty && (
                        <div className="mt-2 text-red-500 text-center">
                            Введите пароль
                        </div>
                    )}
                    {password.isDirty && password.minLengthError && (
                        <div className="mt-2 text-red-500 text-center">
                            Введите пароль от 8 символов
                        </div>
                    )}
                    {password.isDirty && password.maxLengthError && (
                        <div className="mt-2 text-red-500 text-center">
                            Максимальная длина пароля: 30 символов
                        </div>
                    )}
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password.value}
                        onChange={(ev) => password.onChange(ev)}
                        onBlur={(ev) => password.onBlur(ev)}
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
