"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        try {
            const res = await fetch('/api/auth', { credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                setUser(data.admin);
            } else {
                setUser(null);
            }
        } catch (err) {
            setUser(null);
        }
    };
    useEffect(() => {
        fetchUser();
    }, []);

    return(
        <AuthContext.Provider value={{ user, setUser, fetchUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}
