import { createContext } from "react";
import { useState } from "react";
export const UserContext = createContext({});
import { useEffect } from "react";
import axios from "axios";
import { useCallback } from "react";

export default function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const fetchUser = useCallback(async () => {
        if (isLoggingOut) return;
        try {
            const { data } = await axios.get("/users/me", {
                withCredentials: true,
            });
            setUser(data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoaded(true);
        }
    }, [isLoggingOut]);

    const register = useCallback(async (userData) => {
        setIsAuthenticating(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const response = await axios.post("auths/registration", userData, {
                withCredentials: true,
            });

            setSuccessMessage(
                "Вы успешно зарегистрированы! Войдите в учетную запись."
            );
            return response.data;
        } catch (error) {
            let errorMessage = "Ошибка соединения с сервером";

            if (error.response) {
                errorMessage =
                    error.response.data?.message ||
                    error.response.statusText ||
                    `Ошибка сервера (${error.response.status})`;
            } else if (error.request) {
                errorMessage = "Сервер не отвечает";
            }

            setError(errorMessage);
            throw error;
        } finally {
            setIsAuthenticating(false);
        }
    }, []);

    const login = useCallback(
        async (credentials) => {
            setIsAuthenticating(true);
            try {
                const { data } = await axios.post("/auths/login", credentials, {
                    withCredentials: true,
                });

                await fetchUser();

                return data;
            } finally {
                setIsAuthenticating(false);
            }
        },
        [fetchUser]
    );

    const logout = useCallback(async () => {
        setIsLoggingOut(true);
        try {
            await axios.post("/auths/logout", { withCredentials: true });
            setUser(null);
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            setIsLoggingOut(false);
        }
    }, []);

    useEffect(() => {
        if (!isLoggingOut) {
            fetchUser();
        }
    }, [fetchUser, isLoggingOut]);
    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                loaded,
                logout,
                isLoggingOut,
                login,
                fetchUser,
                register,
                error,
                successMessage,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}
