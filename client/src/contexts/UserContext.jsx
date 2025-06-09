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

    const fetchUser = useCallback(async () => {
        if (isLoggingOut) return;
        try {
            const { data } = await axios.get("/users/me");
            setUser(data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoaded(true);
        }
    }, [isLoggingOut]);

    const logout = useCallback(async () => {
        setIsLoggingOut(true);
        try {
            await axios.post("/auths/logout");
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
            value={{ user, setUser, loaded, logout, isLoggingOut }}
        >
            {children}
        </UserContext.Provider>
    );
}
