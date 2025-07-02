"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        try {
            const res = await fetch('/api/auth', {
                credentials: 'include', // penting agar cookie keikut
            });
            const data = await res.json();

            if (res.ok) {
                setUser(data.admin); // sesuaikan dengan response API kamu
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error('fetchUser error:', err);
            setUser(null);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
