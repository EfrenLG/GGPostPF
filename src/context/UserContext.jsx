import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [icon, setIcon] = useState(() => localStorage.getItem("userIcon") || "default.png");

    useEffect(() => {

        const handleStorage = () => {
            setIcon(localStorage.getItem("userIcon") || "default.png");
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    return (
        <UserContext.Provider value={{ icon, setIcon }}>
            {children}
        </UserContext.Provider>
    );
};