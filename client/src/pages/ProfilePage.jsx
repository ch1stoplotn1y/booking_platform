import axios from "axios";
import { useContext } from "react";
import { useState, useEffect } from "react";
import { UserContext } from "../contexts/UserContext.jsx";
import { Link, Navigate, useParams, useNavigate } from "react-router-dom";
import PropertiesPage from "./PropertiesPage.jsx";
import AccountNavigation from "./AccountNavigation.jsx";
export default function ProfilePage() {
    const navigate = useNavigate();
    const { loaded, user, isLoggingOut, logout } = useContext(UserContext);
    let { subpage } = useParams();
    if (subpage === undefined) {
        subpage = "account";
    }

    async function handleLogout() {
        navigate("/");
        await logout();
    }

    if (!loaded) {
        return "Loading...";
    }

    if (loaded && !user) {
        return <Navigate to={"/login"} />;
    }

    // Если пользователь вышел и это обработка выхода - не рендерим профиль
    if (isLoggingOut) {
        return null;
    }

    return (
        <div>
            <AccountNavigation />
            {subpage === "account" && (
                <div className="text-center max-w-lg mx-auto">
                    Добро пожаловать! {user.firstName} {user.lastName}
                    <button
                        onClick={handleLogout}
                        className="login max-w-sm mt-2"
                    >
                        Выйти
                    </button>
                </div>
            )}
            {subpage === "properties" && <PropertiesPage />}
        </div>
    );
}
