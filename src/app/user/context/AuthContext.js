"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // Menyimpan data user/admin + role
  const [loading, setLoading] = useState(true); // Optional: untuk state loading

  const fetchUser = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/auth/login", {
        credentials: "include", // agar cookie JWT ikut
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUser({ ...data.user, role: data.role });
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("fetchUser error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
